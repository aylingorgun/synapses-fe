'use client';

import { useMemo } from 'react';
import StatCard from './StatCard';
import { useStatistics } from '@/hooks/useStatistics';
import { useFilters } from '@/contexts';

const HazardIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2L1 21h22L12 2zm0 3.83L19.13 19H4.87L12 5.83zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
  </svg>
);

const CountryIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
  </svg>
);

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);

const DeathIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const DisasterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.75-.55C9.29 3.71 6 8.2 6 12.5c0 4.14 3.36 7.5 7.5 7.5 4.14 0 7.5-3.36 7.5-7.5 0-.55-.05-1.09-.14-1.63-.1-.54-.67-.82-1.14-.52zm-6.98 5.15c-1.38 0-2.5-1.12-2.5-2.5 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.38-1.12 2.5-2.5 2.5z"/>
  </svg>
);

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
  const { filters } = useFilters();

  const sectionTitle = useMemo(() => {
    if (filters.region) {
      return `${filters.region.label} Statistics`;
    }
    return 'Regional Statistics';
  }, [filters]);

  const sectionSubtitle = useMemo(() => {
    const parts = [];
    if (filters.country) {
      parts.push(filters.country.label);
    }
    if (filters.startDate || filters.endDate) {
      const start = filters.startDate || '1990';
      const end = filters.endDate || '2026';
      parts.push(`${start} - ${end}`);
    }
    if (filters.disasterTypes?.length > 0) {
      parts.push(`${filters.disasterTypes.length} disaster type(s)`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'Overview of all disasters in the region';
  }, [filters]);

  const keyHazardsDisplay = useMemo(() => {
    if (!statistics.keyHazards?.length) return '—';
    return statistics.keyHazards.map(h => h.name).join(', ');
  }, [statistics.keyHazards]);

  return (
    <section className="py-8 px-12 bg-gradient-to-br from-slate-50 to-slate-200 relative max-sm:py-6 max-sm:px-4">
      <div className="absolute top-0 left-[5%] w-[90%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">{sectionTitle}</h2>
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
          subtitle={statistics.mostAffectedCountry 
            ? `${statistics.mostAffectedCountry.count} disasters recorded`
            : 'The country with most disasters'}
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
          subtitle={statistics.mostCommonDisaster 
            ? `Most common: ${statistics.mostCommonDisaster.name}`
            : 'Total recorded disasters'}
          loading={loading}
        />
      </div>

      <div className="text-right mt-6 pr-4">
        <span className="text-sm text-slate-500 italic">info: 1990-2026</span>
      </div>
    </section>
  );
}
