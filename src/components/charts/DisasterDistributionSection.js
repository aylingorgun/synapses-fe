'use client';

import { useState } from 'react';
import Select, { components } from 'react-select';
import DistributionChart from './DistributionChart';
import { useChartData, REGION_CONFIG } from '@/hooks/useChartData';

const REGION_OPTIONS = Object.entries(REGION_CONFIG).map(([key, config]) => ({
  value: key,
  label: config.name,
}));

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          className="w-[18px] h-[18px] accent-[#0468B1] cursor-pointer"
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
    borderColor: state.isFocused ? '#0468B1' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #0468B1' : 'none',
    '&:hover': { borderColor: '#0468B1' },
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
      backgroundColor: '#0468B1',
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

export default function DisasterDistributionSection({ title }) {
  const [selectedFilters, setSelectedFilters] = useState(REGION_OPTIONS);
  const selectedRegions = selectedFilters.map((f) => f.value);
  const { chartData, disasterTypes, loading } = useChartData(selectedRegions);

  const handleFilterChange = (selected) => {
    if (selected && selected.length > 0) {
      setSelectedFilters(selected);
    }
  };

  if (loading) {
    return (
      <section className="py-8 px-12 bg-white border-t border-slate-200 max-md:py-6 max-md:px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">{title}</h2>
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-[#0468B1] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-12 bg-white border-t border-slate-200 max-md:py-6 max-md:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">{title}</h2>
        <div className="flex justify-end mb-6 max-md:justify-stretch">
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
            className="min-w-[280px] max-md:w-full max-md:min-w-0"
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-md:p-4 max-md:overflow-x-auto">
          <DistributionChart
            data={chartData}
            dataKeys={disasterTypes}
            xAxisKey="name"
            height={450}
            showLegend={true}
            showGrid={true}
          />
        </div>
      </div>
    </section>
  );
}
