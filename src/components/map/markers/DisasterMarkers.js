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

  // Handle zoom end to collapse expanded view
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

    // Zoom to country
    map.flyTo(country.coordinates, 6, {
      duration: 0.8,
    });
  };

  const handleDisasterClick = (disaster, country) => {
    console.log('Disaster clicked:', disaster, 'in', country.name);
    // TODO: Show disaster details modal/panel
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
      {/* Clustered markers (default state) */}
      {data.countries.map((country) => (
        <CountryCluster
          key={country.id}
          country={country}
          isSelected={selectedCountry?.id === country.id}
          isHidden={isExpanded && selectedCountry?.id !== country.id}
          onClick={handleClusterClick}
        />
      ))}

      {/* Expanded disasters for selected country */}
      {isExpanded && selectedCountry && (
        <ExpandedDisasters
          country={selectedCountry}
          onDisasterClick={handleDisasterClick}
          onClose={handleClose}
        />
      )}
    </>
  );
}
