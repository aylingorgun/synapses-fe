'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Default region configuration
 * TODO: This should come from API configuration in the future
 */
const DEFAULT_REGION = {
  value: 'western_balkans',
  label: 'Western Balkans & Türkiye',
};

/**
 * Get default date range (last 5 years)
 * @returns {object} Object with startDate and endDate in YYYY-MM-DD format
 */
const getDefaultDateRange = () => {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];

  const fiveYearsAgo = new Date(today);
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const startDate = fiveYearsAgo.toISOString().split('T')[0];

  return { startDate, endDate };
};

/**
 * Create initial filter state
 * @returns {object} Initial filters object
 */
const createInitialFilters = () => {
  const defaultDateRange = getDefaultDateRange();
  return {
    region: DEFAULT_REGION,
    country: null,
    startDate: defaultDateRange.startDate,
    endDate: defaultDateRange.endDate,
    disasterTypes: [],
  };
};

const FilterContext = createContext(null);

/**
 * FilterProvider - Provides filter state management for the application
 * 
 * Usage pattern:
 * - `filters` - Pending filter state (use in FilterBar for UI)
 * - `appliedFilters` - Applied filter state (use in all data-consuming components)
 * - `updateFilter` - Update a single filter value
 * - `updateFilters` - Update multiple filter values at once
 * - `applyFilters` - Apply pending filters to make them active
 * - `resetFilters` - Reset all filters to default values
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function FilterProvider({ children }) {
  // Create initial state only once
  const [initialState] = useState(createInitialFilters);
  
  // Pending filter state (what user is currently editing in FilterBar)
  const [filters, setFilters] = useState(initialState);
  
  // Applied filter state (what components use for data fetching/display)
  const [appliedFilters, setAppliedFilters] = useState(initialState);
  
  // Track if pending filters match applied filters
  const [isApplied, setIsApplied] = useState(true);

  /**
   * Update a single filter value
   * @param {string} key - Filter key to update
   * @param {any} value - New value for the filter
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIsApplied(false);
  }, []);

  /**
   * Update multiple filter values at once
   * @param {object} newFilters - Object with filter key-value pairs to update
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setIsApplied(false);
  }, []);

  /**
   * Apply pending filters - copies filters to appliedFilters
   * @returns {object} The applied filters
   */
  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setIsApplied(true);
    return filters;
  }, [filters]);

  /**
   * Reset all filters to initial default values
   */
  const resetFilters = useCallback(() => {
    const freshInitialState = createInitialFilters();
    setFilters(freshInitialState);
    setAppliedFilters(freshInitialState);
    setIsApplied(true);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      filters,
      appliedFilters,
      isApplied,
      updateFilter,
      updateFilters,
      applyFilters,
      resetFilters,
    }),
    [filters, appliedFilters, isApplied, updateFilter, updateFilters, applyFilters, resetFilters]
  );

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
