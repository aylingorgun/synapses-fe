'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const defaultRegion = {
  value: 'western_balkans_turkiye_cyprus',
  label: 'Western Balkans & Türkiye & Cyprus',
};

const getDefaultDateRange = () => {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  
  const fiveYearsAgo = new Date(today);
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const startDate = fiveYearsAgo.toISOString().split('T')[0];
  
  return { startDate, endDate };
};

const defaultDateRange = getDefaultDateRange();

const initialFilters = {
  region: defaultRegion,
  country: null,
  startDate: defaultDateRange.startDate,
  endDate: defaultDateRange.endDate,
  disasterTypes: [],
};

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isApplied, setIsApplied] = useState(true);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIsApplied(false);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setIsApplied(false);
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setIsApplied(true);
    return filters;
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setIsApplied(true);
  }, []);

  const value = {
    filters,
    appliedFilters,
    isApplied,
    updateFilter,
    updateFilters,
    applyFilters,
    resetFilters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
