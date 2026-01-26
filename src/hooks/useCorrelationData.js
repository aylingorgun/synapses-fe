import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { COLORS, DISASTER_COLORS, LINE_COLORS } from '@/constants/chartColors';

/**
 * Variable definitions for correlation analysis
 * Using existing color palette from chartColors.js
 */
export const CORRELATION_VARIABLES = {
  environmental: {
    label: 'Environmental Variables',
    items: [
      { id: 'temperature', label: 'Temperature', unit: '°C', color: LINE_COLORS.accent },
      { id: 'humidity', label: 'Humidity', unit: '%', color: COLORS.blue90 },
      { id: 'rainfall', label: 'Rainfall', unit: 'mm', color: LINE_COLORS.primary },
      { id: 'snowfall', label: 'Snowfall', unit: 'cm', color: COLORS.brightBlue85 },
    ],
  },
  spatial: {
    label: 'Spatial Features',
    items: [
      { id: 'population', label: 'Population', unit: 'M', color: COLORS.grey64 },
    ],
  },
  disasters: {
    label: 'Disaster Events',
    items: [
      { id: 'flood', label: 'Flood', unit: 'count', color: DISASTER_COLORS.Flood },
      { id: 'earthquake', label: 'Earthquake', unit: 'count', color: DISASTER_COLORS.Earthquake },
      { id: 'fire', label: 'Fire', unit: 'count', color: DISASTER_COLORS.Fire },
      { id: 'drought', label: 'Drought', unit: 'count', color: DISASTER_COLORS.Drought },
      { id: 'storm', label: 'Storm', unit: 'count', color: DISASTER_COLORS.Storm },
      { id: 'extreme_temp', label: 'Extreme Temperature', unit: 'count', color: DISASTER_COLORS['Extreme Temperature'] },
    ],
  },
};

/**
 * Generate mock environmental data based on country
 * TODO: Replace with API call when available
 * 
 * This generates realistic climate change trends:
 * - Temperature: Gradual increase (~0.25°C per year, showing climate warming)
 * - Humidity: Gradual decrease (drier conditions)
 * - Rainfall: Decrease over time with variability (drought conditions)
 * - Snowfall: Decrease as temperature rises
 */
function generateEnvironmentalData(countryData, years) {
  const baseTemp = countryData?.statistics?.avgAnnualTemp || 12;
  const baseYear = years[0] || 2015;
  
  // Use a seed based on country name for consistent but varied results per country
  const countryHash = (countryData?.name || 'default').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  
  return years.map((year, idx) => {
    const yearOffset = year - baseYear;
    
    // Temperature: Clear upward trend (~0.25°C/year) with small annual variation
    // This simulates observed climate change patterns
    const tempTrend = yearOffset * 0.25;
    const tempVariation = Math.sin(yearOffset * 0.7 + countryHash) * 0.4;
    const temperature = parseFloat((baseTemp - 1.5 + tempTrend + tempVariation).toFixed(1));
    
    // Humidity: Decreasing trend (drier air as temps rise)
    const humidityBase = 68 - (countryHash % 10);
    const humidityTrend = -yearOffset * 0.8;
    const humidityVariation = Math.sin(yearOffset * 0.9 + countryHash) * 3;
    const humidity = parseFloat(Math.max(35, Math.min(85, humidityBase + humidityTrend + humidityVariation)).toFixed(1));
    
    // Rainfall: Decreasing trend with year-to-year variability
    // Higher variability simulates extreme weather patterns
    const rainfallBase = 950 - (countryHash % 200);
    const rainfallTrend = -yearOffset * 25; // ~25mm decrease per year
    const rainfallVariation = Math.sin(yearOffset * 1.2 + countryHash * 0.5) * 80;
    const rainfall = Math.max(300, Math.round(rainfallBase + rainfallTrend + rainfallVariation));
    
    // Snowfall: Decreases as temperature rises
    const snowfallBase = Math.max(0, 55 - baseTemp * 2);
    const snowfallTrend = -yearOffset * 2.5;
    const snowfall = Math.max(0, Math.round(snowfallBase + snowfallTrend + Math.sin(yearOffset) * 5));
    
    return { year, temperature, humidity, rainfall, snowfall };
  });
}

/**
 * Generate mock population data
 * TODO: Replace with API call when available
 */
function generatePopulationData(countryData, years) {
  const basePopulation = (countryData?.statistics?.population || 5000000) / 1000000;
  const growthRate = 1.008 + (Math.random() * 0.004);
  
  return years.map((year, idx) => {
    const population = parseFloat((basePopulation * Math.pow(growthRate, idx)).toFixed(2));
    return { year, population };
  });
}

/**
 * Aggregate disaster counts by year from actual disaster data
 */
function aggregateDisastersByYear(countryData, years) {
  const yearlyDisasters = {};
  
  // Initialize all years with zero counts
  years.forEach(year => {
    yearlyDisasters[year] = {
      flood: 0,
      earthquake: 0,
      fire: 0,
      drought: 0,
      storm: 0,
      extreme_temp: 0,
    };
  });

  // Count actual disasters from the data
  if (countryData?.disasters) {
    countryData.disasters.forEach(disaster => {
      const year = disaster.startYear;
      if (yearlyDisasters[year]) {
        const hazardType = (disaster.hazardType || '').toLowerCase();
        
        if (hazardType.includes('flood')) {
          yearlyDisasters[year].flood++;
        } else if (hazardType.includes('earthquake')) {
          yearlyDisasters[year].earthquake++;
        } else if (hazardType.includes('fire')) {
          yearlyDisasters[year].fire++;
        } else if (hazardType.includes('drought')) {
          yearlyDisasters[year].drought++;
        } else if (hazardType.includes('storm')) {
          yearlyDisasters[year].storm++;
        } else if (hazardType.includes('temperature') || hazardType.includes('heat') || hazardType.includes('cold')) {
          yearlyDisasters[year].extreme_temp++;
        }
      }
    });
  }

  return years.map(year => ({
    year,
    ...yearlyDisasters[year],
  }));
}

/**
 * Hook for correlation data between environmental variables and disasters
 * @param {string} countryName - Country name to fetch data for
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 */
export function useCorrelationData(countryName, startDate, endDate) {
  const { data, loading, error } = useDisasterData();

  const result = useMemo(() => {
    if (!data?.countries || !countryName) {
      return {
        data: [],
        variables: CORRELATION_VARIABLES,
        countryData: null,
      };
    }

    const countryData = data.countries.find(
      c => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!countryData) {
      return {
        data: [],
        variables: CORRELATION_VARIABLES,
        countryData: null,
      };
    }

    // Calculate year range from dates
    const startYear = startDate ? new Date(startDate).getFullYear() : 2021;
    const endYear = endDate ? new Date(endDate).getFullYear() : new Date().getFullYear();
    const yearCount = Math.max(1, endYear - startYear + 1);
    const years = Array.from({ length: yearCount }, (_, i) => startYear + i);

    // Environmental/spatial data is mocked (will come from API)
    const environmentalData = generateEnvironmentalData(countryData, years);
    const populationData = generatePopulationData(countryData, years);
    
    // Disaster data comes from actual disasterData.json
    const disasterData = aggregateDisastersByYear(countryData, years);

    const correlationData = years.map((year, idx) => ({
      year,
      ...environmentalData[idx],
      ...populationData[idx],
      ...disasterData[idx],
    }));

    return {
      data: correlationData,
      variables: CORRELATION_VARIABLES,
      countryData,
    };
  }, [data, countryName, startDate, endDate]);

  return {
    ...result,
    loading,
    error,
  };
}

/**
 * Get line configuration for selected variables
 * Returns lines with descriptive legend names including units
 */
export function getLineConfig(selectedVariables) {
  const lines = [];
  
  const allItems = [
    ...CORRELATION_VARIABLES.environmental.items,
    ...CORRELATION_VARIABLES.spatial.items,
    ...CORRELATION_VARIABLES.disasters.items,
  ];

  selectedVariables.forEach(varId => {
    const item = allItems.find(i => i.id === varId);
    if (item) {
      const isDisaster = CORRELATION_VARIABLES.disasters.items.some(d => d.id === varId);
      
      // Build descriptive legend name with unit
      let legendName;
      if (isDisaster) {
        legendName = `${item.label} Events`;
      } else if (item.unit && item.unit !== 'count') {
        legendName = `${item.label} (${item.unit})`;
      } else {
        legendName = item.label;
      }
      
      lines.push({
        dataKey: varId,
        name: legendName,
        unit: item.unit === 'count' ? '' : item.unit,
        color: item.color,
        yAxisId: isDisaster ? 'right' : 'left',
      });
    }
  });

  return lines;
}
