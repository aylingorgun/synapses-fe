import { useState, useEffect } from 'react';
import * as topojson from 'topojson-client';
import { GEO_DATA_URL, TARGET_COUNTRIES } from '@/constants/mapConfig';

export function useGeoData() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GEO_DATA_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch geo data');
        }

        const topoData = await response.json();

        // Convert TopoJSON to GeoJSON
        const geoJsonData = topojson.feature(
          topoData,
          topoData.objects.countries
        );

        // Filter for target countries only
        const filtered = {
          ...geoJsonData,
          features: geoJsonData.features.filter((feature) =>
            TARGET_COUNTRIES.includes(feature.properties.name)
          ),
        };

        setGeoData(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  return { geoData, loading, error };
}
