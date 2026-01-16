'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const defaultRegion = {
  value: 'western_balkans_turkiye_cyprus',
  label: 'Western Balkans & Türkiye & Cyprus',
};

const initialFilters = {
  region: defaultRegion,
  country: null,
  startDate: '',
  endDate: '',
  disasterTypes: [],
};

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isApplied, setIsApplied] = useState(false);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIsApplied(false);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setIsApplied(false);
  }, []);

  const applyFilters = useCallback(() => {
    setIsApplied(true);
    // Return the current filters for any callbacks
    return filters;
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setIsApplied(false);
  }, []);

  const value = {
    filters,
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
