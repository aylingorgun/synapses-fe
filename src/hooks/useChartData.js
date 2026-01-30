import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { REGION_CONFIG } from '@/constants/regionConfig';
import { normalizeDisasterType } from '@/constants/disasterTypes';

export { REGION_CONFIG } from '@/constants/regionConfig';

/**
 * Hook to process disaster data for charts - aggregated by region
 * @param {Array} selectedRegions - Array of selected region keys
 * @returns {Object} { chartData, disasterTypes, loading, error }
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
