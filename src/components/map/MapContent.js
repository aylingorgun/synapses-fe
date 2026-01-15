'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { MAP_CONFIG, TILE_LAYERS } from '@/constants/mapConfig';
import { useGeoData } from '@/hooks/useGeoData';
import CountryBorders from './layers/CountryBorders';
import { DisasterMarkers } from './markers';
import styles from '@/styles/map.module.css';

export default function MapContent() {
  const { geoData, loading, error } = useGeoData();

  if (error) {
    return (
      <div className="h-[600px] w-full bg-red-50 flex items-center justify-center">
        <p className="text-red-500">Error loading map data: {error}</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      minZoom={MAP_CONFIG.minZoom}
      maxZoom={MAP_CONFIG.maxZoom}
      className={styles.mapContainer}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution={TILE_LAYERS.carto.attribution}
        url={TILE_LAYERS.carto.url}
      />

      {!loading && <CountryBorders data={geoData} />}
      
      <DisasterMarkers />
    </MapContainer>
  );
}
