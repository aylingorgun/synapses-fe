'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { MAP_CONFIG, TILE_LAYERS } from '@/constants/mapConfig';
import { useGeoData } from '@/hooks/useGeoData';
import CountryBorders from './layers/CountryBorders';
import { DisasterMarkers } from './markers';
import MapBreadcrumb from './MapBreadcrumb';

const MAP_HEIGHT = '612px';

function MapLayers({ geoData, loading }) {
  return (
    <>
      {!loading && <CountryBorders data={geoData} />}
      <DisasterMarkers />
    </>
  );
}

export default function MapContent() {
  const { geoData, loading, error } = useGeoData();

  if (error) {
    return (
      <div style={{ height: MAP_HEIGHT }} className="w-full bg-red-50 flex items-center justify-center">
        <p className="text-red-500">Error loading map data: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <MapBreadcrumb />
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        style={{ height: MAP_HEIGHT, width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={TILE_LAYERS.carto.attribution}
          url={TILE_LAYERS.carto.url}
        />

        <MapLayers geoData={geoData} loading={loading} />
      </MapContainer>
    </div>
  );
}
