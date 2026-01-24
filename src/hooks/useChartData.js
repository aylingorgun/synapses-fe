import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { REGION_CONFIG } from '@/constants/regionConfig';

export { REGION_CONFIG } from '@/constants/regionConfig';

// Generic disaster type labels - now using hazardType from data
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

  // Direct match with generic types
  if (GENERIC_DISASTER_TYPES[hazardType]) {
    return GENERIC_DISASTER_TYPES[hazardType];
  }

  // Normalize common variations
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

  return hazardType; // Return original if no match
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

    // Initialize region data for selected regions
    selectedRegions.forEach((regionKey) => {
      const config = REGION_CONFIG[regionKey];
      if (config) {
        regionData[regionKey] = {
          name: config.shortName,
          fullName: config.name,
        };
      }
    });

    // Process each country's disasters and aggregate by region
    data.countries.forEach((country) => {
      // Find which region this country belongs to
      const regionKey = Object.keys(REGION_CONFIG).find((key) =>
        REGION_CONFIG[key].countries.includes(country.name)
      );

      if (!regionKey || !selectedRegions.includes(regionKey)) return;

      // Count disasters by type for this region
      country.disasters.forEach((disaster) => {
        // Use hazardType (generic) for aggregation
        const type = normalizeDisasterType(disaster.hazardType);
        disasterTypeSet.add(type);

        if (!regionData[regionKey][type]) {
          regionData[regionKey][type] = 0;
        }
        regionData[regionKey][type]++;
      });
    });

    // Convert to array and calculate totals
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
