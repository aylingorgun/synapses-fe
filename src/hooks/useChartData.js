import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { REGION_CONFIG } from '@/constants/regionConfig';
import filterOptions from '@/data/filterOptions.json';

export { REGION_CONFIG } from '@/constants/regionConfig';

// Build disaster type label map from filterOptions
const DISASTER_TYPE_LABELS = {};
filterOptions.disasterTypes.forEach((dt) => {
  // Map various possible values to labels
  DISASTER_TYPE_LABELS[dt.value] = dt.label;
  DISASTER_TYPE_LABELS[dt.label] = dt.label;
  // Also map camelCase/PascalCase versions
  const normalized = dt.value.replace(/_/g, '').toLowerCase();
  DISASTER_TYPE_LABELS[normalized] = dt.label;
});

// Normalize disaster type name to match filter options
const normalizeDisasterType = (type) => {
  if (!type) return 'Other';

  // Direct match
  if (DISASTER_TYPE_LABELS[type]) return DISASTER_TYPE_LABELS[type];

  // Try lowercase match
  const lower = type.toLowerCase();
  if (DISASTER_TYPE_LABELS[lower]) return DISASTER_TYPE_LABELS[lower];

  // Try without spaces/underscores
  const normalized = lower.replace(/[_\s]/g, '');
  if (DISASTER_TYPE_LABELS[normalized]) return DISASTER_TYPE_LABELS[normalized];

  // Specific mappings for data variations
  const mappings = {
    riverineflood: 'Riverine Flood',
    flashflood: 'Flash Flood',
    coastalflood: 'Coastal Flood',
    urbanflood: 'Urban Flood',
    wildfires: 'Wild Fires',
    forestfires: 'Forest Fires',
    urbanfires: 'Urban Fires',
    extremetemperature: 'Heatwave',
    massmovement: 'Mudflow',
    floods: 'Riverine Flood',
    fires: 'Wild Fires',
  };

  if (mappings[normalized]) return mappings[normalized];

  return type; // Return original if no match
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
        // Use specificHazardName and normalize it
        const rawType = disaster.specificHazardName || disaster.hazardType || 'Other';
        const type = normalizeDisasterType(rawType);
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
