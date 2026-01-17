'use client';

import { createContext, useContext, useState } from 'react';

const MapSelectionContext = createContext(null);

export function MapSelectionProvider({ children }) {
  const [selectedCountryName, setSelectedCountryName] = useState(null);

  return (
    <MapSelectionContext.Provider value={{ selectedCountryName, setSelectedCountryName }}>
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
