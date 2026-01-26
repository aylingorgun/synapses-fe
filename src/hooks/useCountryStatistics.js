import { useMemo } from 'react';
import { useDisasterData } from './useDisasterData';
import { useFilters, useMapSelection } from '@/contexts';

export function useCountryStatistics() {
  const { data, loading, error } = useDisasterData();
  const { appliedFilters } = useFilters();
  const { selectedCountryName } = useMapSelection();

  const countryName = selectedCountryName || appliedFilters.country?.label;

  const countryData = useMemo(() => {
    if (!data?.countries || !countryName) {
      return null;
    }

    const country = data.countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    return country || null;
  }, [data, countryName]);

  const statistics = useMemo(() => {
    if (!countryData?.statistics) {
      return null;
    }

    return countryData.statistics;
  }, [countryData]);

  const isCountrySelected = Boolean(countryName);

  return {
    countryName,
    countryData,
    statistics,
    isCountrySelected,
    loading,
    error,
  };
}
