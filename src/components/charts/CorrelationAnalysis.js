'use client';

import { useState, useMemo } from 'react';
import Select, { components } from 'react-select';
import MultiLineChart from './MultiLineChart';
import { useCorrelationData, getLineConfig, CORRELATION_VARIABLES } from '@/hooks/useCorrelationData';
import { checkboxSelectStyles } from '@/constants/selectStyles';
import { useFilters } from '@/contexts';

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          className="w-[18px] h-[18px] accent-undp-blue cursor-pointer"
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  );
};

// Build separate options for each category
const ENVIRONMENTAL_OPTIONS = CORRELATION_VARIABLES.environmental.items.map(item => ({
  value: item.id,
  label: item.label,
}));

const SPATIAL_OPTIONS = CORRELATION_VARIABLES.spatial.items.map(item => ({
  value: item.id,
  label: item.label,
}));

const DISASTER_OPTIONS = CORRELATION_VARIABLES.disasters.items.map(item => ({
  value: item.id,
  label: item.label,
}));

// Default selections
const DEFAULT_ENVIRONMENTAL = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'rainfall', label: 'Rainfall' },
];

const DEFAULT_SPATIAL = [];

const DEFAULT_DISASTERS = [
  { value: 'flood', label: 'Flood' },
];

/**
 * Correlation Analysis component for country-level environmental and disaster data
 */
export default function CorrelationAnalysis({ countryName }) {
  const { appliedFilters } = useFilters();
  const [environmentalSelection, setEnvironmentalSelection] = useState(DEFAULT_ENVIRONMENTAL);
  const [spatialSelection, setSpatialSelection] = useState(DEFAULT_SPATIAL);
  const [disasterSelection, setDisasterSelection] = useState(DEFAULT_DISASTERS);

  const selectedVariables = useMemo(() => [
    ...environmentalSelection.map(opt => opt.value),
    ...spatialSelection.map(opt => opt.value),
    ...disasterSelection.map(opt => opt.value),
  ], [environmentalSelection, spatialSelection, disasterSelection]);

  // Use dates from filter context
  const { data, loading, error } = useCorrelationData(
    countryName, 
    appliedFilters.startDate, 
    appliedFilters.endDate
  );

  const lineConfig = useMemo(() => 
    getLineConfig(selectedVariables), 
    [selectedVariables]
  );

  const hasDualAxis = useMemo(() => {
    const hasLeftAxis = environmentalSelection.length > 0 || spatialSelection.length > 0;
    const hasRightAxis = disasterSelection.length > 0;
    return hasLeftAxis && hasRightAxis;
  }, [environmentalSelection, spatialSelection, disasterSelection]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500 italic">
        <p>Error loading correlation data</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-6">
        Comparing environmental, demographic, and disaster variables
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          value={environmentalSelection}
          onChange={(selected) => setEnvironmentalSelection(selected || [])}
          options={ENVIRONMENTAL_OPTIONS}
          styles={checkboxSelectStyles}
          components={{ Option: CheckboxOption }}
          isMulti
          isSearchable={false}
          isClearable={false}
          placeholder="Environmental variables..."
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className="min-w-[220px]"
        />
        
        <Select
          value={spatialSelection}
          onChange={(selected) => setSpatialSelection(selected || [])}
          options={SPATIAL_OPTIONS}
          styles={checkboxSelectStyles}
          components={{ Option: CheckboxOption }}
          isMulti
          isSearchable={false}
          isClearable={false}
          placeholder="Spatial variables..."
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className="min-w-[180px]"
        />
        
        <Select
          value={disasterSelection}
          onChange={(selected) => setDisasterSelection(selected || [])}
          options={DISASTER_OPTIONS}
          styles={checkboxSelectStyles}
          components={{ Option: CheckboxOption }}
          isMulti
          isSearchable={false}
          isClearable={false}
          placeholder="Disaster types..."
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className="min-w-[180px]"
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-md:p-4 max-md:overflow-x-auto">
        <MultiLineChart
          data={data}
          lines={lineConfig}
          xAxisKey="year"
          height={450}
          loading={loading}
          showGrid
          dualAxis={hasDualAxis}
          leftAxisLabel="Environmental / Spatial Value"
          rightAxisLabel="Disaster Event Count"
          emptyMessage="Select variables to visualize correlations"
        />
      </div>
    </>
  );
}
