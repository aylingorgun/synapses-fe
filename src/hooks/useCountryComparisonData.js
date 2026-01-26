import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to fetch country vs regional average comparison data from API
 * @param {string} countryName - Name of the selected country
 * @returns {object} { chartData, disasterTypes, regionName, loading, error, refetch }
 */
export function useCountryComparisonData(countryName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComparisonData = useCallback(async () => {
    if (!countryName) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/statistics/country-comparison?country=${encodeURIComponent(countryName)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch comparison data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [countryName]);

  useEffect(() => {
    fetchComparisonData();
  }, [fetchComparisonData]);

  const chartData = data
    ? [
        {
          name: 'Selected Country',
          fullName: data.country.name,
          ...data.country.disasters,
          _total: data.country.total,
        },
        {
          name: 'Regional Average',
          fullName: data.regionalAverage.name,
          ...data.regionalAverage.disasters,
          _total: data.regionalAverage.total,
        },
      ]
    : [];

  return {
    chartData,
    disasterTypes: data?.disasterTypes || [],
    regionName: data?.regionalAverage?.regionShortName || '',
    regionFullName: data?.regionalAverage?.regionName || '',
    countriesInRegion: data?.regionalAverage?.countriesInRegion || 0,
    loading,
    error,
    refetch: fetchComparisonData,
  };
}
