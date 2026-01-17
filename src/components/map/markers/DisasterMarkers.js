'use client';

import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useDisasterData } from '@/hooks/useDisasterData';
import CountryCluster from './CountryCluster';
import ExpandedDisasters from './ExpandedDisasters';

export default function DisasterMarkers() {
  const map = useMap();
  const { data, loading } = useDisasterData();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom <= 4 && isExpanded) {
        setIsExpanded(false);
        setSelectedCountry(null);
      }
    };

    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, isExpanded]);

  const handleClusterClick = (country) => {
    setSelectedCountry(country);
    setIsExpanded(true);

    map.flyTo(country.coordinates, 6, {
      duration: 0.8,
    });
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedCountry(null);
    map.flyTo([45.0, 50.0], 4.5, {
      duration: 0.8,
    });
  };

  if (loading || !data) return null;

  return (
    <>
      {data.countries.map((country) => (
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
