'use client';

import { useMemo } from 'react';
import StatCard from './StatCard';
import { useStatistics } from '@/hooks/useStatistics';
import { useFilters } from '@/contexts';
import {
  HazardIcon,
  CountryIcon,
  MoneyIcon,
  DeathIcon,
  PeopleIcon,
  DisasterIcon,
} from '@/components/icons/StatIcons';

const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return num.toLocaleString();
  return num.toString();
};

const formatCount = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

export default function StatisticsSection() {
  const { statistics, loading } = useStatistics();
  const { appliedFilters } = useFilters();

  const sectionTitle = useMemo(() => {
    if (appliedFilters.country) {
      return `${appliedFilters.country.label} Disaster Statistics`;
    }
    if (appliedFilters.region) {
      return `${appliedFilters.region.label} Statistics`;
    }
    return 'Regional Statistics';
  }, [appliedFilters]);

  const sectionSubtitle = useMemo(() => {
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
    return appliedFilters.country
      ? 'Overview of all disasters in this country'
      : 'Overview of all disasters in the region';
  }, [appliedFilters]);

  const keyHazardsDisplay = useMemo(() => {
    if (!statistics.keyHazards?.length) return '—';
    return statistics.keyHazards.map((h) => h.name).join(', ');
  }, [statistics.keyHazards]);

  return (
    <section className="py-8 px-12 bg-gradient-to-br from-slate-50 to-slate-200 relative max-sm:py-6 max-sm:px-4">
      <div className="absolute top-0 left-[5%] w-[90%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-undp-navy mb-2">{sectionTitle}</h2>
        <p className="text-sm text-slate-500">{sectionSubtitle}</p>
      </div>

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
          value={formatNumber(statistics.gdpLoss)}
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

      <div className="text-right mt-6 pr-4">
        <span className="text-sm text-slate-500 italic">
          {appliedFilters.startDate && appliedFilters.endDate
            ? `Data: ${appliedFilters.startDate.split('-')[0]} - ${appliedFilters.endDate.split('-')[0]}`
            : 'Data: All available years'}
        </span>
      </div>
    </section>
  );
}
