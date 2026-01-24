'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const MapSelectionContext = createContext(null);

export function MapSelectionProvider({ children }) {
  const [selectedCountryName, setSelectedCountryName] = useState(null);
  const closeCallbackRef = useRef(null);

  const registerCloseCallback = useCallback((callback) => {
    closeCallbackRef.current = callback;
  }, []);

  const clearSelection = useCallback(() => {
    if (closeCallbackRef.current) {
      closeCallbackRef.current();
    } else {
      setSelectedCountryName(null);
    }
  }, []);

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
