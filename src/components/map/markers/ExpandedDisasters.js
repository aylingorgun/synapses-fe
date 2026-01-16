'use client';

import { useState, useEffect } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { getDisasterIconPath } from '@/constants/disasterIcons';

// Calculate positions in a spiral/circular pattern
const calculateExpandedPositions = (center, count, baseRadius = 0.8) => {
  const positions = [];
  const [centerLat, centerLng] = center;

  if (count <= 8) {
    // Single circle for 8 or fewer
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * Math.cos(angle);
      const lng = centerLng + baseRadius * 1.5 * Math.sin(angle);
      positions.push([lat, lng]);
    }
  } else {
    // Multiple rings for more disasters
    const innerCount = Math.min(8, Math.ceil(count / 2));
    const outerCount = count - innerCount;

    // Inner ring
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * 0.6 * Math.cos(angle);
      const lng = centerLng + baseRadius * 0.9 * Math.sin(angle);
      positions.push([lat, lng]);
    }

    // Outer ring
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * 1.2 * Math.cos(angle);
      const lng = centerLng + baseRadius * 1.8 * Math.sin(angle);
      positions.push([lat, lng]);
    }
  }

  return positions;
};

// Create disaster icon with SVG
const createDisasterIcon = (disaster, index, isAnimating) => {
  const size = 40;
  const iconPath = getDisasterIconPath(disaster.specificHazardName);

  return L.divIcon({
    className: 'disaster-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #0468B1;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transform: scale(${isAnimating ? 0 : 1});
        opacity: ${isAnimating ? 0 : 1};
        transition: all 0.3s ease;
        transition-delay: ${index * 50}ms;
        overflow: hidden;
      ">
        <img 
          src="${iconPath}" 
          alt="${disaster.hazardType}"
          style="
            width: 24px;
            height: 24px;
            filter: brightness(0) invert(1);
          "
        />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Create center icon (close button)
const createCenterIcon = (disasterCount) => {
  const size = 50;

  return L.divIcon({
    className: 'center-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #1e40af;
        border: 4px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: 20px;
      ">
        ✕
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function ExpandedDisasters({
  country,
  onDisasterClick,
  onClose,
}) {
  const [isAnimating, setIsAnimating] = useState(true);
  const positions = calculateExpandedPositions(
    country.coordinates,
    country.disasters.length
  );

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Center marker */}
      <Marker
        position={country.coordinates}
        icon={createCenterIcon()}
        eventHandlers={{
          click: onClose,
        }}
      />

      {/* Disaster markers */}
      {country.disasters.map((disaster, index) => (
        <Marker
          key={disaster.disNo}
          position={positions[index]}
          icon={createDisasterIcon(disaster, index, isAnimating)}
          eventHandlers={{
            click: () => onDisasterClick(disaster, country),
          }}
        />
      ))}
    </>
  );
}
