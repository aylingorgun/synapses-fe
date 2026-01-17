'use client';

import { useState, useEffect, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getDisasterIconPath } from '@/constants/disasterIcons';
import { formatDate } from '@/utils/dateUtils';

const calculateExpandedPositions = (center, count, baseRadius = 0.8) => {
  const positions = [];
  const [centerLat, centerLng] = center;

  if (count <= 8) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * Math.cos(angle);
      const lng = centerLng + baseRadius * 1.5 * Math.sin(angle);
      positions.push([lat, lng]);
    }
  } else {
    const innerCount = Math.min(8, Math.ceil(count / 2));
    const outerCount = count - innerCount;

    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * 0.6 * Math.cos(angle);
      const lng = centerLng + baseRadius * 0.9 * Math.sin(angle);
      positions.push([lat, lng]);
    }

    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * 2 * Math.PI - Math.PI / 2;
      const lat = centerLat + baseRadius * 1.2 * Math.cos(angle);
      const lng = centerLng + baseRadius * 1.8 * Math.sin(angle);
      positions.push([lat, lng]);
    }
  }

  return positions;
};

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

const createCenterIcon = () => {
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

function DisasterPopupContent({ disaster, country }) {
  const handleReportClick = useCallback(
    (e) => {
      e.stopPropagation();
      const reportPath = disaster.reportUrl || '/reports/sample-report.html';
      window.open(reportPath, '_blank');
    },
    [disaster.reportUrl]
  );

  const title = disaster.location || country.name;
  const truncatedTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;

  return (
    <div className="disaster-popup-content">
      <div className="popup-header">
        <span className="popup-date">
          {formatDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
        </span>
      </div>

      <h3 className="popup-title" title={title}>
        {truncatedTitle}
      </h3>
      <span className="popup-type">{disaster.specificHazardName || disaster.hazardType}</span>

      <p className="popup-summary">
        {disaster.summary ||
          `${disaster.specificHazardName || disaster.hazardType} event affecting ${disaster.location || country.name}.`}
      </p>

      <div className="popup-actions">
        <button
          className="popup-action-btn popup-action-btn-primary popup-action-btn-full"
          onClick={handleReportClick}
          type="button"
        >
          View Report
        </button>
      </div>
    </div>
  );
}

export default function ExpandedDisasters({ country, onClose }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const positions = calculateExpandedPositions(country.coordinates, country.disasters.length);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Marker
        position={country.coordinates}
        icon={createCenterIcon()}
        eventHandlers={{
          click: onClose,
        }}
      />

      {country.disasters.map((disaster, index) => (
        <Marker
          key={disaster.disNo}
          position={positions[index]}
          icon={createDisasterIcon(disaster, index, isAnimating)}
        >
          <Popup
            offset={[0, -20]}
            className="disaster-preview-popup"
            closeButton={true}
            autoPan={true}
            maxWidth={280}
            minWidth={240}
          >
            <DisasterPopupContent disaster={disaster} country={country} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
