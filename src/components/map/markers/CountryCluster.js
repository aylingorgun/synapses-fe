'use client';

import { Marker } from 'react-leaflet';
import L from 'leaflet';

// Create custom cluster icon
const createClusterIcon = (count, isSelected) => {
  const size = Math.min(60, 40 + count * 2);
  const backgroundColor = isSelected ? '#1e40af' : '#3388ff';

  return L.divIcon({
    className: 'custom-cluster-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${backgroundColor};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size > 50 ? '18px' : '16px'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function CountryCluster({
  country,
  isSelected,
  isHidden,
  onClick,
}) {
  const disasterCount = country.disasters.length;

  if (isHidden) return null;

  return (
    <Marker
      position={country.coordinates}
      icon={createClusterIcon(disasterCount, isSelected)}
      eventHandlers={{
        click: () => onClick(country),
      }}
    />
  );
}
