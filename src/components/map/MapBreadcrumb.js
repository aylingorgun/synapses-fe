'use client';

import { useMapSelection, useFilters } from '@/contexts';
import { REGION_CONFIG } from '@/constants/regionConfig';

export default function MapBreadcrumb() {
  const { selectedCountryName, clearSelection } = useMapSelection();
  const { appliedFilters, clearCountryFilter } = useFilters();

  const countryName = selectedCountryName || appliedFilters.country?.label;

  if (!countryName) {
    return null;
  }

  const getRegionName = () => {
    if (appliedFilters.region) {
      const regionConfig = REGION_CONFIG[appliedFilters.region.value];
      return regionConfig?.name || appliedFilters.region.label;
    }
    return 'Region';
  };

  const handleBackToRegion = () => {
    if (selectedCountryName) {
      clearSelection();
    }
    if (appliedFilters.country) {
      clearCountryFilter();
    }
  };

  const regionName = getRegionName();

  return (
    <div className="absolute top-4 left-[60px] z-[400] flex items-center gap-1 bg-white px-4 py-2.5 rounded-lg shadow-md text-sm font-medium animate-fade-in">
      <button
        onClick={handleBackToRegion}
        className="text-gray-500 hover:text-[#0468B1] transition-colors bg-transparent border-none p-0 cursor-pointer"
        title={`Back to ${regionName}`}
      >
        {regionName}
      </button>
      <span className="flex items-center text-gray-400">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
      <span className="text-gray-800 font-semibold">
        {countryName}
      </span>
    </div>
  );
}
