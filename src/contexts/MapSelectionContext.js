'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useFilters } from './FilterContext';

const MapSelectionContext = createContext(null);

export function MapSelectionProvider({ children }) {
  const [selectedCountryName, setSelectedCountryNameInternal] = useState(null);
  const closeCallbackRef = useRef(null);
  const { appliedFilters, setCountryAndApply, clearCountryFilter } = useFilters();

  // Sync from filter context to map selection when filters are applied
  // This handles the case when user selects country from dropdown and clicks Apply
  useEffect(() => {
    const filterCountryName = appliedFilters.country?.label || null;
    setSelectedCountryNameInternal(filterCountryName);
  }, [appliedFilters.country]);

  const registerCloseCallback = useCallback((callback) => {
    closeCallbackRef.current = callback;
  }, []);

  // When setting country from map, also update filter context immediately
  const setSelectedCountryName = useCallback((countryName) => {
    setSelectedCountryNameInternal(countryName);
    
    if (countryName) {
      // Create a country filter object and apply immediately
      const countryFilter = { 
        value: countryName.toLowerCase().replace(/\s+/g, '_'), 
        label: countryName 
      };
      setCountryAndApply(countryFilter);
    } else {
      setCountryAndApply(null);
    }
  }, [setCountryAndApply]);

  const clearSelection = useCallback(() => {
    if (closeCallbackRef.current) {
      closeCallbackRef.current();
    } else {
      setSelectedCountryNameInternal(null);
      clearCountryFilter();
    }
  }, [clearCountryFilter]);

  return (
    <MapSelectionContext.Provider 
      value={{ 
        selectedCountryName, 
        setSelectedCountryName, 
        clearSelection,
        registerCloseCallback 
      }}
    >
      {children}
    </MapSelectionContext.Provider>
  );
}

export function useMapSelection() {
  const context = useContext(MapSelectionContext);
  if (!context) {
    throw new Error('useMapSelection must be used within a MapSelectionProvider');
  }
  return context;
}
