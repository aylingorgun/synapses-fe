'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDisasterData } from '@/hooks/useDisasterData';
import { REGION_CONFIG } from '@/hooks/useChartData';
import { getDisasterIconPath } from '@/constants/disasterIcons';
import { useFilters } from '@/contexts';
import styles from '@/styles/chronology.module.css';
import chartStyles from '@/styles/charts.module.css';

/**
 * Format date from disaster data
 */
const formatDate = (year, month, day) => {
  if (!year) return 'Unknown';
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format short date for timeline display
 */
const formatShortDate = (year, month, day) => {
  if (!year) return '';
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Individual disaster item on the timeline
 */
const ChronologyItem = ({ disaster, isActive, onClick, isTop }) => {
  const iconPath = getDisasterIconPath(disaster.specificHazardName);

  return (
    <div
      className={`${styles.item} ${isTop ? styles.itemTop : styles.itemBottom}`}
      onClick={() => onClick(disaster)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(disaster)}
    >
      <div className={styles.card}>
        <div className={styles.icon}>
          <Image
            src={iconPath}
            alt={disaster.specificHazardName || 'Disaster'}
            width={24}
            height={24}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.type}>
            {disaster.specificHazardName || disaster.hazardType}
          </div>
          <div className={styles.location}>
            {disaster.country}
          </div>
        </div>
      </div>
      <div className={styles.connector} />
      <div className={styles.dot} />
      <div className={styles.date}>
        {formatShortDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
      </div>
    </div>
  );
};

/**
 * Disaster detail popup
 */
const DisasterDetailPopup = ({ disaster, onClose }) => {
  if (!disaster) return null;

  const iconPath = getDisasterIconPath(disaster.specificHazardName);

  return (
    <div className={styles.detail}>
      <button className={styles.detailClose} onClick={onClose} aria-label="Close">
        ×
      </button>
      
      <div className={styles.detailHeader}>
        <div className={styles.detailIcon}>
          <Image
            src={iconPath}
            alt={disaster.specificHazardName || 'Disaster'}
            width={28}
            height={28}
          />
        </div>
        <div>
          <h4 className={styles.detailTitle}>
            {disaster.specificHazardName || disaster.hazardType}
          </h4>
          <p className={styles.detailSubtitle}>
            {disaster.location}, {disaster.country}
          </p>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Start Date</span>
          <span className={styles.detailValue}>
            {formatDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
          </span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>End Date</span>
          <span className={styles.detailValue}>
            {formatDate(disaster.endYear, disaster.endMonth, disaster.endDay)}
          </span>
        </div>

        {disaster.totalDeaths !== null && disaster.totalDeaths !== undefined && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Total Deaths</span>
            <span className={styles.detailValue}>
              {disaster.totalDeaths.toLocaleString()}
            </span>
          </div>
        )}

        {disaster.noAffected && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Affected</span>
            <span className={styles.detailValue}>
              {disaster.noAffected.toLocaleString()}
            </span>
          </div>
        )}

        {disaster.magnitude && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Magnitude</span>
            <span className={styles.detailValue}>
              {disaster.magnitude} {disaster.magnitudeScale || ''}
            </span>
          </div>
        )}

        {disaster.totalEconomicLoss && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Economic Loss</span>
            <span className={styles.detailValue}>
              ${(disaster.totalEconomicLoss / 1000000).toFixed(1)}M
            </span>
          </div>
        )}

        {disaster.sourceOrigin && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Source</span>
            <span className={styles.detailValue}>{disaster.sourceOrigin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Disaster Chronology component
 */
export default function DisasterChronology() {
  const { data, loading } = useDisasterData();
  const { filters } = useFilters();
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const scrollRef = useRef(null);

  const selectedRegion = filters.region;

  // Process disasters for selected region
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

    // Sort by date (oldest first)
    return allDisasters.sort((a, b) => {
      const dateA = new Date(a.startYear, (a.startMonth || 1) - 1, a.startDay || 1);
      const dateB = new Date(b.startYear, (b.startMonth || 1) - 1, b.startDay || 1);
      return dateA - dateB;
    });
  }, [data, selectedRegion]);

  const handleDisasterClick = (disaster) => {
    setSelectedDisaster(selectedDisaster?.disNo === disaster.disNo ? null : disaster);
  };

  const regionDisplayName = selectedRegion 
    ? REGION_CONFIG[selectedRegion.value]?.shortName || selectedRegion.label 
    : 'Region';

  const needsScroll = disasters.length > 6;

  // Scroll to end (most recent dates) on mount and when disasters change
  useEffect(() => {
    if (scrollRef.current && disasters.length > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [disasters]);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Disaster Chronology for {regionDisplayName}</h2>
        <div className={chartStyles.loadingState}>
          <div className={chartStyles.loadingSpinner} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Disaster Chronology for {regionDisplayName}</h2>
      
      {disasters.length === 0 ? (
        <div className={styles.empty}>
          No disasters found for the selected region.
        </div>
      ) : (
        <div className={styles.wrapper}>
          <div 
            ref={scrollRef}
            className={needsScroll ? styles.scroll : undefined}
          >
            <div className={styles.timeline}>
              {/* Horizontal line */}
              <div className={styles.line} />
              
              {/* Disaster items */}
              <div className={styles.items}>
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
        <DisasterDetailPopup
          disaster={selectedDisaster}
          onClose={() => setSelectedDisaster(null)}
        />
      )}
    </section>
  );
}
