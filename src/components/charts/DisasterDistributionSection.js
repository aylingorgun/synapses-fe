'use client';

import { useState } from 'react';
import Select, { components } from 'react-select';
import DistributionChart from './DistributionChart';
import { useChartData, REGION_CONFIG } from '@/hooks/useChartData';
import styles from '@/styles/charts.module.css';

// Region options for multi-select dropdown
const REGION_OPTIONS = Object.entries(REGION_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.name,
}));

// Custom Option component with checkbox
const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{
            width: '18px',
            height: '18px',
            accentColor: '#3388ff',
            cursor: 'pointer',
          }}
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  );
};

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
    backgroundColor: state.isFocused ? '#f0f7ff' : 'white',
    color: '#1e293b',
    cursor: 'pointer',
    padding: '10px 12px',
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
        <div className={styles.chartContent}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.chartSection}>
      <div className={styles.chartContent}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.filterRow}>
          <Select
            value={selectedFilters}
            onChange={handleFilterChange}
            options={REGION_OPTIONS}
            styles={selectStyles}
            components={{ Option: CheckboxOption }}
            isMulti
            isSearchable={false}
            isClearable={false}
            placeholder="Select regions..."
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
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
      </div>
    </section>
  );
}
