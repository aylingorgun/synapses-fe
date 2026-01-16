'use client';

import { useState } from 'react';
import Select from 'react-select';
import DistributionChart from './DistributionChart';
import { useChartData, REGION_CONFIG } from '@/hooks/useChartData';
import styles from '@/styles/charts.module.css';

// Region options for multi-select dropdown
const REGION_OPTIONS = Object.entries(REGION_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.name,
}));

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#3388ff' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #3388ff' : 'none',
    '&:hover': { borderColor: '#3388ff' },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3388ff' : state.isFocused ? '#e0edff' : 'white',
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
    fontSize: '0.875rem',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#1e40af',
    '&:hover': {
      backgroundColor: '#3388ff',
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

export default function DisasterDistributionSection({ title }) {
  // Initialize with all regions selected
  const [selectedFilters, setSelectedFilters] = useState(REGION_OPTIONS);

  // Get selected region values
  const selectedRegions = selectedFilters.map((f) => f.value);

  const { chartData, disasterTypes, loading } = useChartData(selectedRegions);

  const handleFilterChange = (selected) => {
    // Ensure at least one region is selected
    if (selected && selected.length > 0) {
      setSelectedFilters(selected);
    }
  };

  if (loading) {
    return (
      <section className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.chartSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.filterDropdown}>
          <Select
            value={selectedFilters}
            onChange={handleFilterChange}
            options={REGION_OPTIONS}
            styles={selectStyles}
            isMulti
            isSearchable={false}
            placeholder="Select regions..."
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <DistributionChart
          data={chartData}
          dataKeys={disasterTypes}
          xAxisKey="name"
          height={400}
          showLegend={true}
          showGrid={true}
        />
      </div>
    </section>
  );
}
