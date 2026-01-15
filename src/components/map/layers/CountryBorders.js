'use client';

import { GeoJSON } from 'react-leaflet';
import { BORDER_STYLE } from '@/constants/mapConfig';

export default function CountryBorders({ data }) {
  if (!data) return null;

  const onEachFeature = (feature, layer) => {
    const countryName = feature.properties.name;
    layer.bindPopup(`<strong>${countryName}</strong>`);
  };

  return (
    <GeoJSON data={data} style={BORDER_STYLE} onEachFeature={onEachFeature} />
  );
}
