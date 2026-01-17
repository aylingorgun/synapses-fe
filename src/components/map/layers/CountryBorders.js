'use client';

import { useCallback, useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useMapSelection, useFilters } from '@/contexts';
import { REGION_CONFIG } from '@/constants/regionConfig';

const SELECTED_STYLE = {
  fillColor: '#d35400',
  weight: 3,
  opacity: 1,
  color: '#d35400',
  fillOpacity: 0.35,
};

const REGION_STYLE = {
  fillColor: '#0468B1',
  weight: 2,
  opacity: 1,
  color: '#0468B1',
  fillOpacity: 0.25,
};

const DIMMED_STYLE = {
  fillColor: '#94a3b8',
  weight: 1,
  opacity: 0.5,
  color: '#94a3b8',
  fillOpacity: 0.08,
};

const FILTERED_COUNTRY_STYLE = {
  fillColor: '#0468B1',
  weight: 3,
  opacity: 1,
  color: '#0468B1',
  fillOpacity: 0.35,
};

// Name variants for matching geo data with our country names
const NAME_VARIANTS = {
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  Macedonia: 'North Macedonia',
};

export default function CountryBorders({ data }) {
  const { selectedCountryName } = useMapSelection();
  const { appliedFilters } = useFilters();

  const regionCountries = useMemo(() => {
    if (!appliedFilters.region) return [];
    const regionConfig = REGION_CONFIG[appliedFilters.region.value];
    return regionConfig ? regionConfig.countries : [];
  }, [appliedFilters.region]);

  const isInRegion = useCallback(
    (countryName) => {
      const normalizedName = NAME_VARIANTS[countryName] || countryName;
      return regionCountries.includes(normalizedName) || regionCountries.includes(countryName);
    },
    [regionCountries]
  );

  const isFilteredCountry = useCallback(
    (countryName) => {
      if (!appliedFilters.country) return false;
      const normalizedName = NAME_VARIANTS[countryName] || countryName;
      return (
        appliedFilters.country.label.toLowerCase() === normalizedName.toLowerCase() ||
        appliedFilters.country.label.toLowerCase() === countryName.toLowerCase()
      );
    },
    [appliedFilters.country]
  );

  const getStyle = useCallback(
    (feature) => {
      const countryName = feature.properties.name;

      if (selectedCountryName === countryName) return SELECTED_STYLE;
      if (appliedFilters.country && isFilteredCountry(countryName)) return FILTERED_COUNTRY_STYLE;
      if (appliedFilters.country) return DIMMED_STYLE;
      if (isInRegion(countryName)) return REGION_STYLE;
      return DIMMED_STYLE;
    },
    [selectedCountryName, appliedFilters.country, isFilteredCountry, isInRegion]
  );

  const getBaseStyle = useCallback(
    (countryName) => {
      if (appliedFilters.country && isFilteredCountry(countryName)) {
        return FILTERED_COUNTRY_STYLE;
      }
      if (appliedFilters.country) {
        return DIMMED_STYLE;
      }
      if (isInRegion(countryName)) {
        return REGION_STYLE;
      }
      return DIMMED_STYLE;
    },
    [appliedFilters.country, isFilteredCountry, isInRegion]
  );

  const onEachFeature = useCallback(
    (feature, layer) => {
      const countryName = feature.properties.name;
      const baseStyle = getBaseStyle(countryName);

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          if (selectedCountryName !== countryName) {
            layer.setStyle({
              fillOpacity: Math.min(baseStyle.fillOpacity + 0.15, 0.5),
            });
          }
        },
        mouseout: (e) => {
          const layer = e.target;
          if (selectedCountryName !== countryName) {
            layer.setStyle({
              fillOpacity: baseStyle.fillOpacity,
            });
          }
        },
      });

      layer.bindPopup(`<strong>${countryName}</strong>`);
    },
    [selectedCountryName, getBaseStyle]
  );

  if (!data) return null;

  const mapKey = `${selectedCountryName || 'none'}-${appliedFilters.region?.value || 'all'}-${appliedFilters.country?.value || 'none'}`;

  return <GeoJSON key={mapKey} data={data} style={getStyle} onEachFeature={onEachFeature} />;
}
