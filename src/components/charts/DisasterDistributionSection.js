'use client';

import { useState } from 'react';
import Select, { components } from 'react-select';
import DistributionChart from './DistributionChart';
import { useChartData } from '@/hooks/useChartData';
import { REGION_CONFIG } from '@/constants/regionConfig';
import { checkboxSelectStyles } from '@/constants/selectStyles';

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
          className="w-[18px] h-[18px] accent-undp-blue cursor-pointer"
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  );
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
          <h2 className="text-2xl font-bold text-undp-navy mb-4">{title}</h2>
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-undp-blue rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-12 bg-white border-t border-slate-200 max-md:py-6 max-md:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-undp-navy mb-4">{title}</h2>
        <div className="flex justify-end mb-6 max-md:justify-stretch">
          <Select
            value={selectedFilters}
            onChange={handleFilterChange}
            options={REGION_OPTIONS}
            styles={checkboxSelectStyles}
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
