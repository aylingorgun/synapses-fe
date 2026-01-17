'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { useDisasterData } from '@/hooks/useDisasterData';
import { useMapSelection, useFilters } from '@/contexts';
import { REGION_CONFIG } from '@/hooks/useChartData';
import CountryCluster from './CountryCluster';
import ExpandedDisasters from './ExpandedDisasters';

export default function DisasterMarkers() {
  const map = useMap();
  const { data, loading } = useDisasterData();
  const { appliedFilters } = useFilters();
  const { setSelectedCountryName } = useMapSelection();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!data?.countries) return [];

    let countries = data.countries;

    if (appliedFilters.region) {
      const regionConfig = REGION_CONFIG[appliedFilters.region.value];
      if (regionConfig) {
        countries = countries.filter(country =>
          regionConfig.countries.includes(country.name)
        );
      }
    }

    if (appliedFilters.country) {
      countries = countries.filter(
        country => country.name.toLowerCase() === appliedFilters.country.label.toLowerCase()
      );
    }

    return countries.map(country => {
      let disasters = country.disasters;

      if (appliedFilters.startDate) {
        const startDate = new Date(appliedFilters.startDate);
        disasters = disasters.filter(d => {
          const disasterDate = new Date(d.startYear, (d.startMonth || 1) - 1, d.startDay || 1);
          return disasterDate >= startDate;
        });
      }

      if (appliedFilters.endDate) {
        const endDate = new Date(appliedFilters.endDate);
        disasters = disasters.filter(d => {
          const disasterDate = new Date(d.startYear, (d.startMonth || 1) - 1, d.startDay || 1);
          return disasterDate <= endDate;
        });
      }

      if (appliedFilters.disasterTypes?.length > 0) {
        const selectedTypes = appliedFilters.disasterTypes.map(t => t.value.toLowerCase());
        disasters = disasters.filter(d =>
          selectedTypes.some(type =>
            d.specificHazardName?.toLowerCase().includes(type) ||
            d.hazardType?.toLowerCase().includes(type)
          )
        );
      }

      return { ...country, disasters };
    }).filter(country => country.disasters.length > 0);
  }, [data, appliedFilters]);

  useEffect(() => {
    if (selectedCountry && isExpanded) {
      const stillVisible = filteredCountries.some(c => c.id === selectedCountry.id);
      if (!stillVisible) {
        setIsExpanded(false);
        setSelectedCountry(null);
        setSelectedCountryName(null);
      } else {
        const updatedCountry = filteredCountries.find(c => c.id === selectedCountry.id);
        if (updatedCountry) {
          setSelectedCountry(updatedCountry);
        }
      }
    }
  }, [filteredCountries, selectedCountry, isExpanded, setSelectedCountryName]);

  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom <= 4 && isExpanded) {
        setIsExpanded(false);
        setSelectedCountry(null);
        setSelectedCountryName(null);
      }
    };

    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, isExpanded, setSelectedCountryName]);

  const handleClusterClick = (country) => {
    setSelectedCountry(country);
    setIsExpanded(true);
    setSelectedCountryName(country.name);

    map.flyTo(country.coordinates, 6, {
      duration: 0.8,
    });
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedCountry(null);
    setSelectedCountryName(null);
    map.flyTo([45.0, 50.0], 4.5, {
      duration: 0.8,
    });
  };

  if (loading || !data) return null;

  return (
    <>
      {filteredCountries.map((country) => (
        <CountryCluster
          key={country.id}
          country={country}
          isSelected={selectedCountry?.id === country.id}
          isHidden={isExpanded && selectedCountry?.id !== country.id}
          onClick={handleClusterClick}
        />
      ))}

      {isExpanded && selectedCountry && (
        <ExpandedDisasters
          country={selectedCountry}
          onClose={handleClose}
        />
      )}
    </>
  );
}
