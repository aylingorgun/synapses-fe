'use client';

import { useMemo } from 'react';
import Select from 'react-select';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFilters } from '@/contexts';
import styles from '@/styles/filters.module.css';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#3388ff' : '#e2e8f0',
    boxShadow: state.isFocused ? '0 0 0 1px #3388ff' : 'none',
    '&:hover': {
      borderColor: '#3388ff',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3388ff'
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
      backgroundColor: '#3388ff',
      color: 'white',
    },
  }),
};

export default function FilterBar() {
  const { options, loading } = useFilterOptions();
  const { filters, updateFilter, applyFilters, resetFilters } = useFilters();

  // Filter countries based on selected region
  const filteredCountries = useMemo(() => {
    if (!options) return [];
    if (!filters.region) return options.countries;
    return options.countries.filter(
      (country) => country.region === filters.region.value
    );
  }, [options, filters.region]);

  const handleRegionChange = (selected) => {
    updateFilter('region', selected);
    updateFilter('country', null); // Reset country when region changes
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
    const appliedFilters = applyFilters();
    console.log('Applied filters:', appliedFilters);
  };

  const handleReset = () => {
    resetFilters();
    console.log('Filters reset');
  };

  if (loading || !options) {
    return (
      <div className={styles.filterBar}>
        <p className="text-slate-500">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Region</label>
        <Select
          value={filters.region}
          onChange={handleRegionChange}
          options={options.regions}
          placeholder="Select region..."
          isClearable={false}
          styles={selectStyles}
          className={styles.select}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Country</label>
        <Select
          value={filters.country}
          onChange={handleCountryChange}
          options={filteredCountries}
          placeholder="Select country..."
          isClearable
          styles={selectStyles}
          className={styles.select}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={handleDateChange('startDate')}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={handleDateChange('endDate')}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.filterGroupWide}>
        <label className={styles.label}>Disaster Types</label>
        <Select
          value={filters.disasterTypes}
          onChange={handleDisasterTypesChange}
          options={options.disasterTypes}
          placeholder="Select disaster types..."
          isMulti
          isClearable
          styles={selectStyles}
          className={styles.selectWide}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={handleApply} className={styles.applyButton}>
          Apply
        </button>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
}
