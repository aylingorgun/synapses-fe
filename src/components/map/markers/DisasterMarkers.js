'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { useDisasterData } from '@/hooks/useDisasterData';
import { useMapSelection, useFilters } from '@/contexts';
import { REGION_CONFIG } from '@/constants/regionConfig';
import {
  filterDisasters,
  filterCountriesByRegion,
  filterByCountry,
} from '@/utils/filterDisasters';
import CountryCluster from './CountryCluster';
import ExpandedDisasters from './ExpandedDisasters';

export default function DisasterMarkers() {
  const map = useMap();
  const { data, loading } = useDisasterData();
  const { appliedFilters } = useFilters();
  const { setSelectedCountryName, registerCloseCallback } = useMapSelection();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!data?.countries) return [];

    let countries = data.countries;

    // Filter by region
    if (appliedFilters.region) {
      const regionConfig = REGION_CONFIG[appliedFilters.region.value];
      countries = filterCountriesByRegion(countries, regionConfig);
    }

    // Filter by specific country
    if (appliedFilters.country) {
      countries = filterByCountry(countries, appliedFilters.country);
    }

    // Filter disasters within each country
    return countries
      .map((country) => ({
        ...country,
        disasters: filterDisasters(country.disasters, appliedFilters),
      }))
      .filter((country) => country.disasters.length > 0);
  }, [data, appliedFilters]);

  useEffect(() => {
    if (selectedCountry && isExpanded) {
      const stillVisible = filteredCountries.some((c) => c.id === selectedCountry.id);
      if (!stillVisible) {
        setIsExpanded(false);
        setSelectedCountry(null);
        setSelectedCountryName(null);
      } else {
        const updatedCountry = filteredCountries.find((c) => c.id === selectedCountry.id);
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

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSelectedCountry(null);
    setSelectedCountryName(null);
    map.flyTo([45.0, 50.0], 4.5, {
      duration: 0.8,
    });
  }, [map, setSelectedCountryName]);

  useEffect(() => {
    registerCloseCallback(handleClose);
  }, [registerCloseCallback, handleClose]);

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
        <ExpandedDisasters country={selectedCountry} onClose={handleClose} />
      )}
    </>
  );
}
