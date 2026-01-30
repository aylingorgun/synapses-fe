import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { REGION_CONFIG, getCountryRegion } from '@/constants/regionConfig';
import { normalizeDisasterType } from '@/constants/disasterTypes';

/**
 * Hook to calculate country vs regional average comparison
 * @param {string} countryName - Name of the selected country
 * @returns {Object} { chartData, disasterTypes, regionName, loading, error }
 */
export function useCountryComparisonData(countryName) {
  const { data, loading, error } = useDisasterData();

  const comparisonData = useMemo(() => {
    if (!data?.countries || !countryName) {
      return null;
    }

    const regionKey = getCountryRegion(countryName);
    if (!regionKey) {
      return { error: `Country "${countryName}" not found in any region` };
    }

    const regionConfig = REGION_CONFIG[regionKey];
    const regionCountries = regionConfig.countries;
    const disasterTypeSet = new Set();
    const countryDisasters = {};
    const regionTotalDisasters = {};
    let countriesWithDataInRegion = 0;

    data.countries.forEach((country) => {
      if (!regionCountries.includes(country.name)) return;

      const isSelectedCountry = country.name.toLowerCase() === countryName.toLowerCase();

      if (country.disasters && country.disasters.length > 0) {
        countriesWithDataInRegion++;
      }

      country.disasters.forEach((disaster) => {
        const type = normalizeDisasterType(disaster.hazardType);
        disasterTypeSet.add(type);

        if (isSelectedCountry) {
          countryDisasters[type] = (countryDisasters[type] || 0) + 1;
        }

        regionTotalDisasters[type] = (regionTotalDisasters[type] || 0) + 1;
      });
    });

    const numCountriesInRegion = regionCountries.length;
    const regionalAverage = {};
    Object.keys(regionTotalDisasters).forEach((type) => {
      regionalAverage[type] = Math.round((regionTotalDisasters[type] / numCountriesInRegion) * 10) / 10;
    });

    const disasterTypes = Array.from(disasterTypeSet).sort();
    const countryTotal = Object.values(countryDisasters).reduce((sum, val) => sum + val, 0);
    const regionalAverageTotal = Object.values(regionalAverage).reduce((sum, val) => sum + val, 0);

    return {
      country: {
        name: countryName,
        disasters: countryDisasters,
        total: countryTotal,
      },
      regionalAverage: {
        name: `${regionConfig.shortName} Avg`,
        regionKey,
        regionName: regionConfig.name,
        regionShortName: regionConfig.shortName,
        disasters: regionalAverage,
        total: Math.round(regionalAverageTotal * 10) / 10,
        countriesInRegion: numCountriesInRegion,
        countriesWithData: countriesWithDataInRegion,
      },
      disasterTypes,
    };
  }, [data, countryName]);

  const chartData = comparisonData && !comparisonData.error
    ? [
        {
          name: 'Selected Country',
          fullName: comparisonData.country.name,
          ...comparisonData.country.disasters,
          _total: comparisonData.country.total,
        },
        {
          name: 'Regional Average',
          fullName: comparisonData.regionalAverage.name,
          ...comparisonData.regionalAverage.disasters,
          _total: comparisonData.regionalAverage.total,
        },
      ]
    : [];

  return {
    chartData,
    disasterTypes: comparisonData?.disasterTypes || [],
    regionName: comparisonData?.regionalAverage?.regionShortName || '',
    regionFullName: comparisonData?.regionalAverage?.regionName || '',
    countriesInRegion: comparisonData?.regionalAverage?.countriesInRegion || 0,
    loading,
    error: error || comparisonData?.error || null,
  };
}
