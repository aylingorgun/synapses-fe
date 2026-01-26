'use client';

import { useMemo } from 'react';
import StatCard from './StatCard';
import { useStatistics } from '@/hooks/useStatistics';
import { useCountryStatistics } from '@/hooks/useCountryStatistics';
import { useFilters } from '@/contexts';
import { DonutChart, LineChart } from '@/components/charts';
import { formatCurrency, formatCount, formatPopulation, formatArea, formatTemperature } from '@/utils';
import {
  HazardIcon,
  CountryIcon,
  MoneyIcon,
  DeathIcon,
  PeopleIcon,
  DisasterIcon,
  AreaIcon,
  TemperatureIcon,
  ShieldIcon,
  ChartIcon,
  InfoRiskIcon,
} from '@/components/icons/StatIcons';

const LAST_UPDATED = 'January 2024';

function ChartCard({ title, subtitle, lastUpdated, fullWidth = false, children }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold text-undp-navy">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
            Updated: {lastUpdated}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function RegionStatistics({ statistics, loading, keyHazardsDisplay }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-[1200px] mx-auto max-lg:grid-cols-2 max-sm:grid-cols-1">
      <StatCard
        icon={<HazardIcon />}
        title="Key Hazards"
        value={keyHazardsDisplay}
        subtitle="Key hazards by region"
        loading={loading}
      />

      <StatCard
        icon={<CountryIcon />}
        title="Most Affected Country"
        value={statistics.mostAffectedCountry?.name || '—'}
        subtitle={
          statistics.mostAffectedCountry
            ? `${statistics.mostAffectedCountry.count} disasters recorded`
            : 'The country with most disasters'
        }
        loading={loading}
      />

      <StatCard
        icon={<MoneyIcon />}
        title="GDP Loss"
        value={formatCurrency(statistics.gdpLoss)}
        subtitle="Total economic loss"
        loading={loading}
      />

      <StatCard
        icon={<DeathIcon />}
        title="Total Deaths"
        value={formatCount(statistics.totalDeaths)}
        subtitle="Number of fatalities"
        loading={loading}
      />

      <StatCard
        icon={<PeopleIcon />}
        title="Total # of People Affected"
        value={formatCount(statistics.totalAffected)}
        subtitle="People affected by disasters"
        loading={loading}
      />

      <StatCard
        icon={<DisasterIcon />}
        title="Total Disasters"
        value={statistics.totalDisasters}
        subtitle={
          statistics.mostCommonDisaster
            ? `Most common: ${statistics.mostCommonDisaster.name}`
            : 'Total recorded disasters'
        }
        loading={loading}
      />
    </div>
  );
}

function CountryStatistics({ countryStats, countryName, keyHazardsDisplay, loading }) {
  const unemploymentData = useMemo(() => {
    if (!countryStats?.unemploymentRate) return [];
    const rate = countryStats.unemploymentRate;
    return [
      { name: 'Unemployed', value: rate },
      { name: 'Employed', value: 100 - rate },
    ];
  }, [countryStats]);

  const demographicsData = useMemo(() => {
    if (!countryStats?.demographics) return [];
    const { children, women, olderPersons, personsWithDisabilities } = countryStats.demographics;
    const men = 100 - (women || 0);
    return [
      { name: 'Men (18–59)', value: men },
      { name: 'Women (18–59)', value: women || 0 },
      { name: 'Children (0–17)', value: children || 0 },
      { name: 'Older Persons (60+)', value: olderPersons || 0 },
      { name: 'Persons with Disabilities', value: personsWithDisabilities || 0 },
    ].filter((d) => d.value > 0);
  }, [countryStats]);

  const temperatureData = useMemo(() => {
    if (!countryStats?.temperatureHistory) return [];
    return countryStats.temperatureHistory;
  }, [countryStats]);

  const hasChartData = unemploymentData.length > 0 || demographicsData.length > 0 || temperatureData.length > 0;

  if (!countryStats) {
    return (
      <div className="flex items-center justify-center h-[200px] text-slate-500 italic">
        <p>No statistics available for {countryName}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard
          icon={<HazardIcon />}
          title="Key Hazards"
          value={keyHazardsDisplay}
          subtitle="Top hazard types"
          loading={loading}
        />

        <StatCard
          icon={<PeopleIcon />}
          title="Total Population"
          value={formatPopulation(countryStats.population)}
          subtitle="Estimated population"
          loading={loading}
        />

        <StatCard
          icon={<AreaIcon />}
          title="Total Land Area"
          value={formatArea(countryStats.landArea)}
          subtitle="Country land area"
          loading={loading}
        />

        <StatCard
          icon={<TemperatureIcon />}
          title="Avg. Annual Temp"
          value={formatTemperature(countryStats.avgAnnualTemp)}
          subtitle="Average temperature"
          loading={loading}
        />

        <StatCard
          icon={<ShieldIcon />}
          title="Lack of Coping Capacity"
          value={countryStats.lackOfCopingCapacity ?? '—'}
          subtitle="Scale 0-10 (higher = less capacity)"
          loading={loading}
        />

        <StatCard
          icon={<MoneyIcon />}
          title="GDP per Capita (PPP)"
          value={formatCurrency(countryStats.gdpPerCapita)}
          subtitle="Purchasing power parity"
          loading={loading}
        />

        <StatCard
          icon={<ChartIcon />}
          title="Human Development Index"
          value={countryStats.hdi ?? '—'}
          subtitle="HDI score (0-1)"
          loading={loading}
        />

        <StatCard
          icon={<InfoRiskIcon />}
          title="INFORM Risk Score"
          value={countryStats.informRiskScore ?? '—'}
          subtitle="Risk assessment (0-10)"
          loading={loading}
        />
      </div>

      {hasChartData && (
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {unemploymentData.length > 0 && (
            <ChartCard
              title="Unemployment Rate"
              subtitle="Labor force participation"
              lastUpdated={LAST_UPDATED}
            >
              <DonutChart
                data={unemploymentData}
                loading={loading}
                colors={['#ef4444', '#22c55e']}
                innerRadius={45}
                outerRadius={75}
                height={260}
                emptyMessage="Unemployment data not available"
              />
            </ChartCard>
          )}

          {demographicsData.length > 0 && (
            <ChartCard
              title="Population Demographics"
              subtitle="Gender and vulnerable groups as % of population"
              lastUpdated={LAST_UPDATED}
            >
              <DonutChart
                data={demographicsData}
                loading={loading}
                colors={['#0ea5e9', '#ec4899', '#3b82f6', '#f59e0b', '#8b5cf6']}
                innerRadius={45}
                outerRadius={75}
                height={260}
                emptyMessage="Demographics data not available"
              />
            </ChartCard>
          )}

          {temperatureData.length > 0 && (
            <ChartCard
              title="Temperature Change Over Time"
              subtitle="Average annual temperature (°C) from 2015 to present"
              lastUpdated={LAST_UPDATED}
              fullWidth
            >
              <LineChart
                data={temperatureData}
                dataKey="temp"
                xAxisKey="year"
                loading={loading}
                height={300}
                showAverage
                averageLabel="Avg"
                unit="°C"
                trendColors={{ positive: '#ef4444', negative: '#22c55e' }}
                emptyMessage="Temperature history not available"
                valueFormatter={(value) => `${value}°`}
              />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}

export default function StatisticsSection() {
  const { statistics, loading } = useStatistics();
  const { 
    isCountrySelected, 
    countryName, 
    statistics: countryStats, 
    loading: countryLoading 
  } = useCountryStatistics();
  const { appliedFilters } = useFilters();

  const sectionTitle = useMemo(() => {
    if (isCountrySelected && countryName) {
      return `${countryName} Statistics`;
    }
    if (appliedFilters.region) {
      return `${appliedFilters.region.label} Statistics`;
    }
    return 'Regional Statistics';
  }, [appliedFilters, isCountrySelected, countryName]);

  const sectionSubtitle = useMemo(() => {
    if (isCountrySelected) {
      return 'Key country indicators and risk metrics';
    }
    const parts = [];
    if (appliedFilters.startDate && appliedFilters.endDate) {
      const startYear = appliedFilters.startDate.split('-')[0];
      const endYear = appliedFilters.endDate.split('-')[0];
      parts.push(`${startYear} - ${endYear}`);
    }
    if (appliedFilters.disasterTypes?.length > 0) {
      parts.push(`${appliedFilters.disasterTypes.length} disaster type(s)`);
    }
    if (parts.length > 0) {
      return parts.join(' • ');
    }
    return 'Overview of all disasters in the region';
  }, [appliedFilters, isCountrySelected]);

  const keyHazardsDisplay = useMemo(() => {
    if (!statistics.keyHazards?.length) return '—';
    return statistics.keyHazards.map((h) => h.name).join(', ');
  }, [statistics.keyHazards]);

  const sourceText = useMemo(() => {
    if (isCountrySelected) {
      return 'Source: World Bank, UNDP, INFORM';
    }
    if (appliedFilters.startDate && appliedFilters.endDate) {
      return `Data: ${appliedFilters.startDate.split('-')[0]} - ${appliedFilters.endDate.split('-')[0]}`;
    }
    return 'Data: All available years';
  }, [isCountrySelected, appliedFilters]);

  return (
    <section className="py-8 px-12 bg-gradient-to-br from-slate-50 to-slate-200 relative max-sm:py-6 max-sm:px-4">
      <div className="absolute top-0 left-[5%] w-[90%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-undp-navy mb-2">{sectionTitle}</h2>
        <p className="text-sm text-slate-500">{sectionSubtitle}</p>
      </div>

      {isCountrySelected ? (
        <CountryStatistics
          countryStats={countryStats}
          countryName={countryName}
          keyHazardsDisplay={keyHazardsDisplay}
          loading={countryLoading}
        />
      ) : (
        <RegionStatistics
          statistics={statistics}
          loading={loading}
          keyHazardsDisplay={keyHazardsDisplay}
        />
      )}

      <div className="text-right mt-6 pr-4">
        <span className="text-sm text-slate-500 italic">{sourceText}</span>
      </div>
    </section>
  );
}
