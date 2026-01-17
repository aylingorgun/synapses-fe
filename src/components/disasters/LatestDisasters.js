'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useDisasterData } from '@/hooks/useDisasterData';
import { useFilters } from '@/contexts/FilterContext';
import { getDisasterIconPath } from '@/constants/disasterIcons';
import filterOptions from '@/data/filterOptions.json';
import styles from '@/styles/latestDisasters.module.css';

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
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          <Image
            src={iconPath}
            alt={disaster.specificHazardName || 'Disaster'}
            width={64}
            height={64}
            className={styles.placeholderIcon}
          />
        </div>
        <div className={styles.typeBadge}>
          <Image
            src={iconPath}
            alt=""
            width={16}
            height={16}
            className={styles.badgeIcon}
          />
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.date}>
          {formatDate(disaster.startYear, disaster.startMonth, disaster.startDay)}
        </span>
        
        <h3 className={styles.title}>
          {disaster.country} - {disaster.specificHazardName || disaster.hazardType}
        </h3>
        
        <p className={styles.description}>
          {disaster.summary || 
           `${disaster.specificHazardName || disaster.hazardType} event affecting ${disaster.location || disaster.country}. ${
             disaster.noAffected ? `${disaster.noAffected.toLocaleString()} people affected.` : ''
           }`}
        </p>
        
        <button 
          className={styles.readMore}
          onClick={handleReadMore}
          type="button"
        >
          Read More
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Latest Disasters</h2>
          <p className={styles.sectionSubtitle}>Loading disaster reports...</p>
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.loadingCard} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const regionLabel = filters.region?.label || 'All Regions';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Latest Disasters</h2>
        <p className={styles.sectionSubtitle}>
          Recent disaster events in {regionLabel}. Click on a card to view the full report.
        </p>
        
        <div className={styles.grid}>
          {latestDisasters.map((disaster) => (
            <DisasterCard key={disaster.disNo} disaster={disaster} />
          ))}
        </div>
        
        <div className={styles.viewAllContainer}>
          <button 
            className={styles.viewAllBtn}
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
