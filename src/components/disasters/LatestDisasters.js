'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useDisasterData } from '@/hooks/useDisasterData';
import { useFilters } from '@/contexts/FilterContext';
import { getDisasterIconPath } from '@/constants/disasterIcons';
import filterOptions from '@/data/filterOptions.json';

const formatDate = (year, month, day) => {
  if (!year) return 'Unknown';
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getRegionCountries = (regionValue) => {
  const region = filterOptions.regions.find((r) => r.value === regionValue);
  return region ? region.countries : [];
};

const DisasterCard = ({ disaster }) => {
  const iconPath = getDisasterIconPath(disaster.specificHazardName);
  
  const handleReadMore = () => {
    const reportPath = disaster.reportUrl || '/reports/sample-report.html';
    window.open(reportPath, '_blank');
  };

  return (
    <article className="bg-white rounded overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="relative w-full h-40 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-[#4a6fa5] via-[#2d4a6f] to-[#1e3a5f] flex items-center justify-center relative before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,100,100,0.3)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(255,150,100,0.2)_0%,transparent_40%)]">
          <Image
            src={iconPath}
            alt={disaster.specificHazardName || 'Disaster'}
            width={64}
            height={64}
            className="drop-shadow-md opacity-50"
          />
        </div>
      </div>
      <div className="p-4 pb-5">
        <span className="block text-xs font-medium text-[#0468B1] mb-1">
          {formatDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
        </span>
        <h3 className="text-base font-semibold text-[#0468B1] mb-2.5 leading-snug">
          {disaster.country} - {disaster.specificHazardName || disaster.hazardType}
        </h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {disaster.summary || 
           `${disaster.specificHazardName || disaster.hazardType} event affecting ${disaster.location || disaster.country}. ${
             disaster.noAffected ? `${disaster.noAffected.toLocaleString()} people affected.` : ''
           }`}
        </p>
        <button 
          className="inline-flex items-center gap-1.5 bg-transparent border-none p-0 text-sm font-semibold text-orange-600 cursor-pointer transition-colors hover:text-orange-700 group"
          onClick={handleReadMore}
          type="button"
        >
          Read More
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12,5 19,12 12,19"/>
          </svg>
        </button>
      </div>
    </article>
  );
};

export default function LatestDisasters() {
  const { data, loading } = useDisasterData();
  const { filters } = useFilters();

  const regionCountries = useMemo(() => {
    if (!filters.region?.value) return [];
    return getRegionCountries(filters.region.value);
  }, [filters.region]);

  const latestDisasters = useMemo(() => {
    if (!data?.countries) return [];

    const allDisasters = [];
    
    data.countries.forEach((country) => {
      if (regionCountries.length > 0 && !regionCountries.includes(country.name)) {
        return;
      }

      country.disasters.forEach((disaster) => {
        allDisasters.push({
          ...disaster,
          country: country.name,
        });
      });
    });

    return allDisasters
      .sort((a, b) => {
        const dateA = new Date(a.startYear, (a.startMonth || 1) - 1, a.startDay || 1);
        const dateB = new Date(b.startYear, (b.startMonth || 1) - 1, b.startDay || 1);
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [data, regionCountries]);

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 max-sm:py-10">
        <div className="max-w-[1200px] mx-auto px-8 max-sm:px-4">
          <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">Latest Disasters</h2>
          <p className="text-sm text-gray-500 mb-8">Loading disaster reports...</p>
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded h-[280px]" 
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const regionLabel = filters.region?.label || 'All Regions';

  return (
    <section className="bg-slate-50 py-16 max-sm:py-10">
      <div className="max-w-[1200px] mx-auto px-8 max-sm:px-4">
        <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">Latest Disasters</h2>
        <p className="text-sm text-gray-500 mb-8">
          Recent disaster events in {regionLabel}. Click on a card to view the full report.
        </p>
        
        <div className="grid grid-cols-3 gap-6 mb-8 max-lg:grid-cols-2 max-lg:[&>*:nth-child(3)]:hidden max-sm:grid-cols-1 max-sm:gap-4">
          {latestDisasters.map((disaster) => (
            <DisasterCard key={disaster.disNo} disaster={disaster} />
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            className="inline-flex items-center justify-center py-3 px-7 bg-transparent border border-[#1e3a5f] rounded text-sm font-medium text-[#1e3a5f] cursor-pointer transition-all hover:bg-[#1e3a5f] hover:text-white"
            onClick={handleViewAll}
            type="button"
          >
            View All Disasters
          </button>
        </div>
      </div>
    </section>
  );
}
