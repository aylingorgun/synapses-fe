import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { useFilters } from '@/contexts/FilterContext';
import { REGION_CONFIG } from '@/constants/regionConfig';
import { filterDisasters } from '@/utils/filterDisasters';
import { normalizeDisasterType } from '@/constants/disasterTypes';

/**
 * Normalize season values to standard format
 * @param {string} season - Raw season value from data
 * @returns {string} Normalized season (Spring, Summer, Autumn, Winter)
 */
function normalizeSeason(season) {
  if (!season) return null;
  
  const normalized = season.trim();
  const lower = normalized.toLowerCase();
  
  // Map common variations to standard seasons
  const seasonMap = {
    'spring': 'Spring',
    'summer': 'Summer',
    'autumn': 'Autumn',
    'fall': 'Autumn',
    'winter': 'Winter',
  };
  
  return seasonMap[lower] || normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

/**
 * Hook to aggregate disaster data for radar chart
 * Groups by Country, Disaster Type, and Season, counts distinct disNo
 * Returns one radar per country with disaster types as series
 * 
 * @returns {Object} { countryRadars, countries, seasons, loading, error }
 */
export function useRadarChartData() {
  const { data, loading, error } = useDisasterData();
  const { appliedFilters } = useFilters();

  const radarData = useMemo(() => {
    if (!data?.countries || loading) {
      return { countryRadars: [], countries: [] };
    }

    // Get selected region
    const selectedRegion = appliedFilters.region;
    if (!selectedRegion) {
      return { countryRadars: [], countries: [] };
    }

    const regionKey = selectedRegion.value;
    const regionConfig = REGION_CONFIG[regionKey];
    
    if (!regionConfig) {
      return { countryRadars: [], countries: [] };
    }

    // Collect all disasters from countries in the selected region
    const allDisasters = [];
    
    data.countries.forEach((country) => {
      // Check if country belongs to selected region
      if (!regionConfig.countries.includes(country.name)) {
        return;
      }

      country.disasters.forEach((disaster) => {
        allDisasters.push({
          ...disaster,
          country: country.name,
        });
      });
    });

    // Apply date and disaster type filters
    const filteredDisasters = filterDisasters(allDisasters, appliedFilters);

    // Aggregate: Group by Country, Disaster Type, and Season
    // Structure: "Country|DisasterType|Season" -> Set of disNo
    const aggregationMap = new Map();
    const countryTypeTotals = new Map(); // key: "Country|DisasterType" -> Set of disNo
    
    filteredDisasters.forEach((disaster) => {
      const season = normalizeSeason(disaster.eventSeason);
      const disasterType = normalizeDisasterType(disaster.hazardType);
      
      if (!season || !disaster.disNo) return;
      
      const country = disaster.country;
      const key = `${country}|${disasterType}|${season}`;
      const countryTypeKey = `${country}|${disasterType}`;
      
      // Track season-specific counts per country and disaster type
      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, new Set());
      }
      aggregationMap.get(key).add(disaster.disNo);
      
      // Track total counts per country per disaster type
      if (!countryTypeTotals.has(countryTypeKey)) {
        countryTypeTotals.set(countryTypeKey, new Set());
      }
      countryTypeTotals.get(countryTypeKey).add(disaster.disNo);
    });

    // Get unique countries, disaster types, and seasons
    const countriesSet = new Set();
    const disasterTypeSet = new Set();
    const seasonsSet = new Set(['Spring', 'Summer', 'Autumn', 'Winter']);
    
    aggregationMap.forEach((disNoSet, key) => {
      const [country, disasterType, season] = key.split('|');
      countriesSet.add(country);
      disasterTypeSet.add(disasterType);
      if (season) seasonsSet.add(season);
    });

    const countries = Array.from(countriesSet).sort();
    const disasterTypes = Array.from(disasterTypeSet).sort();
    const seasons = Array.from(seasonsSet).sort((a, b) => {
      const order = { Spring: 0, Summer: 1, Autumn: 2, Winter: 3 };
      return (order[a] || 999) - (order[b] || 999);
    });

    // Build radar chart data structure
    // One radar per country, with disaster types as series
    const countryRadars = countries.map((country) => {
      // Get disaster types that have data for this country
      const disasterTypesForCountry = disasterTypes.filter(disasterType => {
        const countryTypeKey = `${country}|${disasterType}`;
        return countryTypeTotals.has(countryTypeKey);
      });

      // Build data structure: one data point per season, with disaster type values
      const chartData = seasons.map((season) => {
        const dataPoint = { axis: season };
        
        disasterTypesForCountry.forEach((disasterType) => {
          const countryTypeKey = `${country}|${disasterType}`;
          const totalEvents = countryTypeTotals.get(countryTypeKey)?.size || 0;
          const key = `${country}|${disasterType}|${season}`;
          const seasonEvents = aggregationMap.get(key)?.size || 0;
          const percentage = totalEvents > 0 ? (seasonEvents / totalEvents) * 100 : 0;
          
          dataPoint[disasterType] = Math.round(percentage * 10) / 10;
        });
        
        return dataPoint;
      });

      return {
        country,
        data: chartData,
        disasterTypes: disasterTypesForCountry,
        totalEvents: disasterTypesForCountry.reduce((sum, disasterType) => {
          const countryTypeKey = `${country}|${disasterType}`;
          return sum + (countryTypeTotals.get(countryTypeKey)?.size || 0);
        }, 0),
      };
    });

    return {
      countryRadars,
      countries,
      seasons,
    };
  }, [data, appliedFilters, loading]);

  return {
    countryRadars: radarData.countryRadars,
    countries: radarData.countries,
    seasons: radarData.seasons,
    loading,
    error,
  };
}
