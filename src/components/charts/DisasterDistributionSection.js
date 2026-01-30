'use client';

import { useState, useMemo } from 'react';
import Select, { components } from 'react-select';
import DistributionChart from './DistributionChart';
import RadarChart from './RadarChart';
import { useChartData } from '@/hooks/useChartData';
import { useCountryComparisonData } from '@/hooks/useCountryComparisonData';
import { useRadarChartData } from '@/hooks/useRadarChartData';
import { REGION_CONFIG } from '@/constants/regionConfig';
import { checkboxSelectStyles } from '@/constants/selectStyles';
import { CHART_COLORS } from '@/constants/chartColors';
import { useMapSelection } from '@/contexts';

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

function RegionDistribution({ selectedFilters, onFilterChange }) {
  const selectedRegions = selectedFilters.map((f) => f.value);
  const { chartData, disasterTypes, loading } = useChartData(selectedRegions);
  const { countryRadars, seasons, loading: radarLoading } = useRadarChartData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-undp-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6 max-md:justify-stretch">
        <Select
          value={selectedFilters}
          onChange={onFilterChange}
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

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-md:p-4 max-md:overflow-x-auto mb-8">
        <DistributionChart
          data={chartData}
          dataKeys={disasterTypes}
          xAxisKey="name"
          height={450}
          showLegend={true}
          showGrid={true}
        />
      </div>


      {/* Radar Charts: Seasonal Distribution by Country */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-undp-navy mb-2">Seasonal Distribution of Disasters</h2>
        <p className="text-sm text-slate-500">Percentage of events per season within each country, by disaster type</p>
      </div>

      <div className="mt-8 max-md:p-4 max-md:overflow-x-auto mb-8">       
        {radarLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-undp-blue rounded-full animate-spin" />
          </div>
        ) : countryRadars.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500">
            No disaster data available for the selected region
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryRadars.map((countryRadar, index) => (
              <div
                key={countryRadar.country}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4"
              >
                <h4 className="text-sm font-semibold text-slate-800 mb-3 text-center">
                  {countryRadar.country}
                </h4>
                <RadarChart
                  data={countryRadar.data}
                  dataKeys={countryRadar.disasterTypes}
                  axisKeys={seasons}
                  height={300}
                  loading={false}
                  emptyMessage="No data"
                  colors={CHART_COLORS}
                  showLegend={true}
                  isPercentage={true}
                />
                {countryRadar.totalEvents > 0 && (
                  <p className="text-xs text-slate-500 text-center mt-2">
                    {countryRadar.totalEvents} total event{countryRadar.totalEvents !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CountryComparisonDistribution({ countryName }) {
  const { chartData, disasterTypes, regionName, countriesInRegion, loading, error } = useCountryComparisonData(countryName);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-undp-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  const displayData = chartData.map((item, index) => ({
    ...item,
    name: index === 0 ? countryName : `${regionName} Average`,
  }));

  return (
    <>
      <p className="text-sm text-slate-500 mb-6">
        Comparing {countryName}&apos;s disaster distribution with the {regionName} regional average
        {countriesInRegion > 0 && (
          <span className="text-slate-400"> (based on {countriesInRegion} countries in region)</span>
        )}
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-md:p-4 max-md:overflow-x-auto">
        <DistributionChart
          data={displayData}
          dataKeys={disasterTypes}
          xAxisKey="name"
          height={450}
          showLegend={true}
          showGrid={true}
        />
      </div>
    </>
  );
}

export default function DisasterDistributionSection({ title }) {
  const [selectedFilters, setSelectedFilters] = useState(REGION_OPTIONS);
  const { selectedCountryName } = useMapSelection();

  const handleFilterChange = (selected) => {
    if (selected && selected.length > 0) {
      setSelectedFilters(selected);
    }
  };

  const sectionTitle = useMemo(() => {
    if (selectedCountryName) {
      return `Disaster Distribution: ${selectedCountryName} vs Regional Average`;
    }
    return title;
  }, [selectedCountryName, title]);

  return (
    <section className="py-8 px-12 bg-white border-t border-slate-200 max-md:py-6 max-md:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-undp-navy mb-4">{sectionTitle}</h2>
        
        {selectedCountryName ? (
          <CountryComparisonDistribution countryName={selectedCountryName} />
        ) : (
          <RegionDistribution 
            selectedFilters={selectedFilters} 
            onFilterChange={handleFilterChange} 
          />
        )}
      </div>
    </section>
  );
}
