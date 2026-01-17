'use client';

import { useMemo } from 'react';
import Select from 'react-select';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFilters } from '@/contexts';
import { baseSelectStyles } from '@/constants/selectStyles';

export default function FilterBar() {
  const { options, loading } = useFilterOptions();
  const { filters, updateFilter, applyFilters, resetFilters } = useFilters();

  const filteredCountries = useMemo(() => {
    if (!options) return [];
    if (!filters.region) return options.countries;
    return options.countries.filter((country) => country.region === filters.region.value);
  }, [options, filters.region]);

  const handleRegionChange = (selected) => {
    updateFilter('region', selected);
    updateFilter('country', null);
  };

  const handleCountryChange = (selected) => {
    updateFilter('country', selected);
  };

  const handleDateChange = (field) => (e) => {
    updateFilter(field, e.target.value);
  };

  const handleDisasterTypesChange = (selected) => {
    updateFilter('disasterTypes', selected || []);
  };

  const handleApply = () => {
    applyFilters();
  };

  const handleReset = () => {
    resetFilters();
  };

  if (loading || !options) {
    return (
      <div className="flex flex-wrap items-end gap-4 px-6 py-4 bg-white/95 backdrop-blur border-t border-slate-200 relative z-[1000]">
        <p className="text-slate-500">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-4 px-6 py-4 bg-white/95 backdrop-blur border-t border-slate-200 relative z-[1000]">
      <div className="flex flex-col gap-1 min-w-[180px]">
        <label
          htmlFor="region-select"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          Region
        </label>
        <Select
          inputId="region-select"
          value={filters.region}
          onChange={handleRegionChange}
          options={options.regions}
          placeholder="Select region..."
          isClearable={false}
          styles={baseSelectStyles}
          className="min-w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label
          htmlFor="country-select"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          Country
        </label>
        <Select
          inputId="country-select"
          value={filters.country}
          onChange={handleCountryChange}
          options={filteredCountries}
          placeholder="Select country..."
          isClearable
          styles={baseSelectStyles}
          className="min-w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label
          htmlFor="start-date"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={filters.startDate}
          onChange={handleDateChange('startDate')}
          aria-label="Filter start date"
          className="h-[38px] px-3 border border-slate-200 rounded text-sm text-slate-800 bg-white cursor-pointer transition-all hover:border-undp-blue focus:outline-none focus:border-undp-blue focus:ring-1 focus:ring-undp-blue"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label
          htmlFor="end-date"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={filters.endDate}
          onChange={handleDateChange('endDate')}
          aria-label="Filter end date"
          className="h-[38px] px-3 border border-slate-200 rounded text-sm text-slate-800 bg-white cursor-pointer transition-all hover:border-undp-blue focus:outline-none focus:border-undp-blue focus:ring-1 focus:ring-undp-blue"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[280px] flex-1">
        <label
          htmlFor="disaster-types-select"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          Disaster Types
        </label>
        <Select
          inputId="disaster-types-select"
          value={filters.disasterTypes}
          onChange={handleDisasterTypesChange}
          options={options.disasterTypes}
          placeholder="Select disaster types..."
          isMulti
          isClearable
          styles={baseSelectStyles}
          className="min-w-[280px]"
        />
      </div>

      <div className="flex gap-2 ml-auto max-md:w-full max-md:ml-0">
        <button
          onClick={handleApply}
          className="h-[38px] px-6 bg-undp-blue text-white border-none rounded text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-600 max-md:flex-1"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="h-[38px] px-6 bg-white text-slate-500 border border-slate-200 rounded text-sm font-semibold cursor-pointer transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 max-md:flex-1"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
