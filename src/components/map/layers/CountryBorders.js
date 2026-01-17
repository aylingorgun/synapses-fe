'use client';

import { useCallback } from 'react';
import { GeoJSON } from 'react-leaflet';
import { BORDER_STYLE } from '@/constants/mapConfig';
import { useMapSelection } from '@/contexts';

const SELECTED_STYLE = {
  fillColor: '#d35400',
  weight: 3,
  opacity: 1,
  color: '#d35400',
  fillOpacity: 0.35,
};

export default function CountryBorders({ data }) {
  const { selectedCountryName } = useMapSelection();

  const getStyle = useCallback((feature) => {
    if (selectedCountryName === feature.properties.name) {
      return SELECTED_STYLE;
    }
    return BORDER_STYLE;
  }, [selectedCountryName]);

  const onEachFeature = useCallback((feature, layer) => {
    const countryName = feature.properties.name;
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        if (selectedCountryName !== countryName) {
          layer.setStyle({
            fillOpacity: 0.4,
          });
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        if (selectedCountryName !== countryName) {
          layer.setStyle({
            fillOpacity: BORDER_STYLE.fillOpacity,
          });
        }
      },
    });

    layer.bindPopup(`<strong>${countryName}</strong>`);
  }, [selectedCountryName]);

  if (!data) return null;

  return (
    <GeoJSON 
      key={selectedCountryName || 'default'}
      data={data} 
      style={getStyle} 
      onEachFeature={onEachFeature} 
    />
  );
}
