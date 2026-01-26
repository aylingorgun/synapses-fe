import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { REGION_CONFIG } from '@/constants/regionConfig';

export { REGION_CONFIG } from '@/constants/regionConfig';

const GENERIC_DISASTER_TYPES = {
  'Earthquake': 'Earthquake',
  'Flood': 'Flood',
  'Fire': 'Fire',
  'Storm': 'Storm',
  'Extreme Temperature': 'Extreme Temperature',
  'Drought': 'Drought',
  'Mass Movement': 'Mass Movement',
  'Tsunami': 'Tsunami',
};

/**
 * Normalize disaster type to a generic category
 * @param {string} hazardType - The hazardType from the data
 * @returns {string} The normalized generic disaster type
 */
const normalizeDisasterType = (hazardType) => {
  if (!hazardType) return 'Other';

  if (GENERIC_DISASTER_TYPES[hazardType]) {
    return GENERIC_DISASTER_TYPES[hazardType];
  }

  const normalized = hazardType.toLowerCase().replace(/[_\s-]/g, '');
  
  const mappings = {
    'earthquake': 'Earthquake',
    'flood': 'Flood',
    'floods': 'Flood',
    'fire': 'Fire',
    'fires': 'Fire',
    'storm': 'Storm',
    'storms': 'Storm',
    'extremetemperature': 'Extreme Temperature',
    'drought': 'Drought',
    'massmovement': 'Mass Movement',
    'tsunami': 'Tsunami',
  };

  if (mappings[normalized]) {
    return mappings[normalized];
  }

  return hazardType;
};

/**
 * Hook to process disaster data for charts - aggregated by region
 * @param {Array} selectedRegions - Array of selected region values
 */
export function useChartData(selectedRegions = []) {
  const { data, loading, error } = useDisasterData();

  const processedData = useMemo(() => {
    if (!data?.countries || !selectedRegions.length) {
      return { chartData: [], disasterTypes: [] };
    }

    const disasterTypeSet = new Set();
    const regionData = {};

    selectedRegions.forEach((regionKey) => {
      const config = REGION_CONFIG[regionKey];
      if (config) {
        regionData[regionKey] = {
          name: config.shortName,
          fullName: config.name,
        };
      }
    });

    data.countries.forEach((country) => {
      const regionKey = Object.keys(REGION_CONFIG).find((key) =>
        REGION_CONFIG[key].countries.includes(country.name)
      );

      if (!regionKey || !selectedRegions.includes(regionKey)) return;

      country.disasters.forEach((disaster) => {
        const type = normalizeDisasterType(disaster.hazardType);
        disasterTypeSet.add(type);

        if (!regionData[regionKey][type]) {
          regionData[regionKey][type] = 0;
        }
        regionData[regionKey][type]++;
      });
    });

    const chartData = Object.values(regionData).map((region) => {
      const total = Object.entries(region)
        .filter(([key]) => key !== 'name' && key !== 'fullName')
        .reduce((sum, [, count]) => sum + count, 0);
      return { ...region, _total: total };
    });

    const disasterTypes = Array.from(disasterTypeSet).sort();

    return { chartData, disasterTypes };
  }, [data, selectedRegions]);

  return {
    chartData: processedData.chartData,
    disasterTypes: processedData.disasterTypes,
    loading,
    error,
  };
}
