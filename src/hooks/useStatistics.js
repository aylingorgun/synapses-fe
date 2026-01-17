import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { useFilters } from '@/contexts';
import { REGION_CONFIG } from '@/constants/regionConfig';
import {
  filterDisasters,
  filterCountriesByRegion,
  filterByCountry,
} from '@/utils/filterDisasters';

export function useStatistics() {
  const { data, loading, error } = useDisasterData();
  const { appliedFilters } = useFilters();

  const statistics = useMemo(() => {
    if (!data?.countries) {
      return {
        keyHazards: [],
        mostAffectedCountry: null,
        gdpLoss: 0,
        totalDeaths: 0,
        totalAffected: 0,
        totalDisasters: 0,
        hazardBreakdown: {},
      };
    }

    // Filter countries by region
    let filteredCountries = data.countries;

    if (appliedFilters.region) {
      const regionConfig = REGION_CONFIG[appliedFilters.region.value];
      filteredCountries = filterCountriesByRegion(filteredCountries, regionConfig);
    }

    // Filter by specific country
    if (appliedFilters.country) {
      filteredCountries = filterByCountry(filteredCountries, appliedFilters.country);
    }

    // Get all disasters from filtered countries
    let allDisasters = filteredCountries.flatMap((country) => country.disasters);

    // Apply date and type filters using shared utility
    allDisasters = filterDisasters(allDisasters, appliedFilters);

    // Calculate statistics
    const totalDeaths = allDisasters.reduce((sum, d) => sum + (d.totalDeaths || 0), 0);
    const totalAffected = allDisasters.reduce((sum, d) => sum + (d.noAffected || 0), 0);
    const gdpLoss = allDisasters.reduce((sum, d) => sum + (d.totalEconomicLoss || 0), 0);
    const totalDisasters = allDisasters.length;

    // Build hazard breakdown
    const hazardBreakdown = allDisasters.reduce((acc, d) => {
      const type = d.hazardType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Get top 3 hazards
    const keyHazards = Object.entries(hazardBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Get most affected country
    const countryCounts = filteredCountries
      .map((country) => ({
        name: country.name,
        count: country.disasters.length,
      }))
      .sort((a, b) => b.count - a.count);

    const mostAffectedCountry = countryCounts[0] || null;

    // Get most common disaster type
    const mostCommonDisaster = Object.entries(hazardBreakdown).sort((a, b) => b[1] - a[1])[0];

    return {
      keyHazards,
      mostAffectedCountry,
      gdpLoss,
      totalDeaths,
      totalAffected,
      totalDisasters,
      hazardBreakdown,
      mostCommonDisaster: mostCommonDisaster
        ? {
            name: mostCommonDisaster[0],
            count: mostCommonDisaster[1],
          }
        : null,
    };
  }, [data, appliedFilters]);

  return {
    statistics,
    loading,
    error,
  };
}
