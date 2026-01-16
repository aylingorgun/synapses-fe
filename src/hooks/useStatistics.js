import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { useFilters } from '@/contexts';

export function useStatistics() {
  const { data, loading, error } = useDisasterData();
  const { filters, appliedFilters, isApplied } = useFilters();

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

    // Get active filters (use applied if available, otherwise current)
    const activeFilters = isApplied ? appliedFilters : filters;
    
    // Filter countries based on region selection
    let filteredCountries = data.countries;
    
    if (activeFilters.region) {
      const regionMapping = {
        'western_balkans_turkiye_cyprus': 'Western Balkans & Türkiye & Cyprus',
        'south_caucasus_western_cis': 'South Caucasus & Western CIS',
        'central_asia': 'Central Asia',
      };
      const regionName = regionMapping[activeFilters.region.value];
      
      filteredCountries = data.countries.filter(country =>
        country.disasters.some(d => d.region === regionName)
      );
    }

    // Filter by country if selected
    if (activeFilters.country) {
      filteredCountries = filteredCountries.filter(
        country => country.name.toLowerCase() === activeFilters.country.label.toLowerCase()
      );
    }

    // Collect all disasters from filtered countries
    let allDisasters = filteredCountries.flatMap(country => country.disasters);

    // Filter by date range if specified
    if (activeFilters.startDate) {
      const startDate = new Date(activeFilters.startDate);
      allDisasters = allDisasters.filter(d => {
        const disasterDate = new Date(d.startYear, d.startMonth - 1, d.startDay);
        return disasterDate >= startDate;
      });
    }

    if (activeFilters.endDate) {
      const endDate = new Date(activeFilters.endDate);
      allDisasters = allDisasters.filter(d => {
        const disasterDate = new Date(d.startYear, d.startMonth - 1, d.startDay);
        return disasterDate <= endDate;
      });
    }

    // Filter by disaster types if specified
    if (activeFilters.disasterTypes?.length > 0) {
      const selectedTypes = activeFilters.disasterTypes.map(t => t.value.toLowerCase());
      allDisasters = allDisasters.filter(d =>
        selectedTypes.some(type => 
          d.specificHazardName?.toLowerCase().includes(type) ||
          d.hazardType?.toLowerCase().includes(type)
        )
      );
    }

    // Calculate statistics
    const totalDeaths = allDisasters.reduce((sum, d) => sum + (d.totalDeaths || 0), 0);
    const totalAffected = allDisasters.reduce((sum, d) => sum + (d.noAffected || 0), 0);
    const gdpLoss = allDisasters.reduce((sum, d) => sum + (d.totalEconomicLoss || 0), 0);
    const totalDisasters = allDisasters.length;

    // Count hazards by type
    const hazardBreakdown = allDisasters.reduce((acc, d) => {
      const type = d.hazardType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Get top hazards
    const keyHazards = Object.entries(hazardBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Find most affected country
    const countryCounts = filteredCountries.map(country => ({
      name: country.name,
      count: country.disasters.length,
    })).sort((a, b) => b.count - a.count);

    const mostAffectedCountry = countryCounts[0] || null;

    // Get most common disaster type
    const mostCommonDisaster = Object.entries(hazardBreakdown)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      keyHazards,
      mostAffectedCountry: mostAffectedCountry,
      gdpLoss,
      totalDeaths,
      totalAffected,
      totalDisasters,
      hazardBreakdown,
      mostCommonDisaster: mostCommonDisaster ? {
        name: mostCommonDisaster[0],
        count: mostCommonDisaster[1],
      } : null,
    };
  }, [data, filters, appliedFilters, isApplied]);

  return {
    statistics,
    loading,
    error,
  };
}
