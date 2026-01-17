'use client';

import { useMemo } from 'react';
import Select from 'react-select';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFilters } from '@/contexts';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#0468B1' : '#e2e8f0',
    boxShadow: state.isFocused ? '0 0 0 1px #0468B1' : 'none',
    '&:hover': {
      borderColor: '#0468B1',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#0468B1'
      : state.isFocused
        ? '#e0edff'
        : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#e0edff',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e40af',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#1e40af',
    '&:hover': {
      backgroundColor: '#0468B1',
      color: 'white',
    },
  }),
};

export default function FilterBar() {
  const { options, loading } = useFilterOptions();
  const { filters, updateFilter, applyFilters, resetFilters } = useFilters();

  const filteredCountries = useMemo(() => {
    if (!options) return [];
    if (!filters.region) return options.countries;
    return options.countries.filter(
      (country) => country.region === filters.region.value
    );
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
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</label>
        <Select
          value={filters.region}
          onChange={handleRegionChange}
          options={options.regions}
          placeholder="Select region..."
          isClearable={false}
          styles={selectStyles}
          className="min-w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Country</label>
        <Select
          value={filters.country}
          onChange={handleCountryChange}
          options={filteredCountries}
          placeholder="Select country..."
          isClearable
          styles={selectStyles}
          className="min-w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={handleDateChange('startDate')}
          className="h-[38px] px-3 border border-slate-200 rounded text-sm text-slate-800 bg-white cursor-pointer transition-all hover:border-[#0468B1] focus:outline-none focus:border-[#0468B1] focus:ring-1 focus:ring-[#0468B1]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={handleDateChange('endDate')}
          className="h-[38px] px-3 border border-slate-200 rounded text-sm text-slate-800 bg-white cursor-pointer transition-all hover:border-[#0468B1] focus:outline-none focus:border-[#0468B1] focus:ring-1 focus:ring-[#0468B1]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[280px] flex-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disaster Types</label>
        <Select
          value={filters.disasterTypes}
          onChange={handleDisasterTypesChange}
          options={options.disasterTypes}
          placeholder="Select disaster types..."
          isMulti
          isClearable
          styles={selectStyles}
          className="min-w-[280px]"
        />
      </div>

      <div className="flex gap-2 ml-auto max-md:w-full max-md:ml-0">
        <button
          onClick={handleApply}
          className="h-[38px] px-6 bg-[#0468B1] text-white border-none rounded text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-600 max-md:flex-1"
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
