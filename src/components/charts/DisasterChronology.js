'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDisasterData } from '@/hooks/useDisasterData';
import { REGION_CONFIG } from '@/constants/regionConfig';
import { getDisasterIconPath } from '@/constants/disasterIcons';
import { useFilters } from '@/contexts';
import { formatDate, formatShortDate } from '@/utils/dateUtils';

const ChronologyItem = ({ disaster, isActive, onClick, isTop }) => {
  const iconPath = getDisasterIconPath(disaster.specificHazardName, disaster.hazardType);

  return (
    <div
      className={`flex flex-col items-center w-[180px] flex-shrink-0 cursor-pointer relative h-full max-md:w-[140px] ${
        isTop ? 'justify-start pt-2.5' : 'justify-end pb-2.5'
      } group`}
      onClick={() => onClick(disaster)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(disaster)}
    >
      <div
        className={`bg-white/[0.08] rounded-xl p-3.5 flex flex-col items-center gap-2 w-[140px] max-md:w-[120px] max-md:p-2 transition-all group-hover:bg-white/[0.15] group-hover:scale-[1.03] ${isTop ? 'order-1' : 'order-4'}`}
      >
        <div className="w-11 h-11 flex items-center justify-center bg-undp-blue border-[3px] border-white rounded-full shadow-md">
          <Image
            src={iconPath}
            alt={disaster.hazardType}
            width={24}
            height={24}
            className="brightness-0 invert"
          />
        </div>
        <div className="text-center w-full">
          <div className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {disaster.hazardType}
          </div>
          <div className="text-xs text-white/70 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
            {disaster.country}
          </div>
        </div>
      </div>
      <div className={`w-0.5 h-10 max-md:h-7 bg-white/40 ${isTop ? 'order-2' : 'order-3'}`} />
      <div
        className={`w-3.5 h-3.5 bg-white rounded-full shadow-md flex-shrink-0 absolute top-1/2 -translate-y-1/2 ${isTop ? 'order-3' : 'order-2'}`}
      />
      <div
        className={`text-xs text-white/80 font-medium whitespace-nowrap py-2 absolute ${isTop ? 'top-[calc(50%+20px)] order-4' : 'top-[calc(50%-45px)] order-1'}`}
      >
        {formatShortDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
      </div>
    </div>
  );
};

const DisasterDetailPopup = ({ disaster }) => {
  if (!disaster) return null;

  const iconPath = getDisasterIconPath(disaster.specificHazardName, disaster.hazardType);

  return (
    <div className="bg-white/10 rounded-xl p-6 mx-8 mt-6 relative max-md:mx-4 max-md:mt-4">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/15">
        <div className="w-[50px] h-[50px] flex items-center justify-center bg-undp-blue border-[3px] border-white rounded-full shadow-md">
          <Image
            src={iconPath}
            alt={disaster.hazardType}
            width={28}
            height={28}
            className="brightness-0 invert"
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">
            {disaster.hazardType}
          </h4>
          <p className="text-sm text-white/70">
            {disaster.location}, {disaster.country}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">Start Date</span>
          <span className="text-sm text-white">
            {formatDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">End Date</span>
          <span className="text-sm text-white">
            {formatDate(disaster.endYear, disaster.endMonth, disaster.endDay)}
          </span>
        </div>

        {disaster.totalDeaths !== null && disaster.totalDeaths !== undefined && (
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">
              Total Deaths
            </span>
            <span className="text-sm text-white">{disaster.totalDeaths.toLocaleString()}</span>
          </div>
        )}

        {disaster.noAffected && (
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">Affected</span>
            <span className="text-sm text-white">{disaster.noAffected.toLocaleString()}</span>
          </div>
        )}

        {disaster.magnitude && (
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">Magnitude</span>
            <span className="text-sm text-white">
              {disaster.magnitude} {disaster.magnitudeScale || ''}
            </span>
          </div>
        )}

        {disaster.totalEconomicLoss && (
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">
              Economic Loss
            </span>
            <span className="text-sm text-white">
              ${(disaster.totalEconomicLoss / 1000000).toFixed(1)}M
            </span>
          </div>
        )}

        {disaster.sourceOrigin && (
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] text-white/50 uppercase tracking-wide">Source</span>
            <span className="text-sm text-white">{disaster.sourceOrigin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DisasterChronology() {
  const { data, loading } = useDisasterData();
  const { filters } = useFilters();
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const scrollRef = useRef(null);
  const detailRef = useRef(null);

  const selectedRegion = filters.region;

  const disasters = useMemo(() => {
    if (!data?.countries || !selectedRegion) return [];

    const allDisasters = [];
    const regionKey = selectedRegion.value;

    data.countries.forEach((country) => {
      const countryRegionKey = Object.keys(REGION_CONFIG).find((key) =>
        REGION_CONFIG[key].countries.includes(country.name)
      );

      if (countryRegionKey !== regionKey) return;

      country.disasters.forEach((disaster) => {
        allDisasters.push({
          ...disaster,
          country: country.name,
        });
      });
    });

    return allDisasters.sort((a, b) => {
      const dateA = new Date(a.startYear, (a.startMonth || 1) - 1, a.startDay || 1);
      const dateB = new Date(b.startYear, (b.startMonth || 1) - 1, b.startDay || 1);
      return dateA - dateB;
    });
  }, [data, selectedRegion]);

  const handleDisasterClick = (disaster) => {
    setSelectedDisaster(disaster);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const regionDisplayName = selectedRegion
    ? REGION_CONFIG[selectedRegion.value]?.shortName || selectedRegion.label
    : 'Region';

  const needsScroll = disasters.length > 6;

  useEffect(() => {
    if (scrollRef.current && disasters.length > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [disasters]);

  if (loading) {
    return (
      <section className="bg-undp-navy w-full py-8 max-md:py-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10 max-md:text-xl max-md:pl-4">
            Disaster Chronology for {regionDisplayName}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-undp-blue rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-undp-navy w-full py-8 max-md:py-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-white mb-10 max-md:text-xl max-md:pl-4">
          Disaster Chronology for {regionDisplayName}
        </h2>
      </div>

      {disasters.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-white/60 italic">
          No disasters found for the selected region.
        </div>
      ) : (
        <div className="relative w-full">
          <div
            ref={scrollRef}
            className={
              needsScroll
                ? 'overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/50'
                : ''
            }
          >
            <div className="relative min-h-[380px] min-w-max">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/40 z-[1]" />
              <div className="flex relative z-[2] px-20 max-md:px-10 h-[380px] gap-6 max-md:gap-4">
                {disasters.map((disaster, index) => (
                  <ChronologyItem
                    key={disaster.disNo}
                    disaster={disaster}
                    isActive={selectedDisaster?.disNo === disaster.disNo}
                    onClick={handleDisasterClick}
                    isTop={index % 2 === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDisaster && (
        <div ref={detailRef}>
          <DisasterDetailPopup disaster={selectedDisaster} />
        </div>
      )}
    </section>
  );
}
