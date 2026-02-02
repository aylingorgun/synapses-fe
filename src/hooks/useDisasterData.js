import { useState, useEffect } from 'react';
import { parseCSV } from '@/utils/csvParser';
import countryStatisticsData from '@/data/countryStatistics.json';

/**
 * CSV data endpoints by country ISO code
 * Replace with API URLs in production
 */
const CSV_ENDPOINTS = {
  ALB: '/data/albania.csv',
  ARM: '/data/armenia.csv',
  BIH: '/data/bosnia.csv',
  BLR: '/data/belarus.csv',
  CYP: '/data/cyprus.csv',
  GEO: '/data/georgia.csv',
  KAZ: '/data/kazakhstan.csv',
  KGZ: '/data/kyrgyzstan.csv',
  KOS: '/data/kosovo.csv',
  MDA: '/data/moldova.csv',
  MKD: '/data/northmacedonia.csv',
  MNE: '/data/montenegro.csv',
  SRB: '/data/serbia.csv',
  TJK: '/data/tajikistan.csv',
  TKM: '/data/turkmenistan.csv',
  TUR: '/data/turkey.csv',
  UKR: '/data/ukraine.csv',
  UZB: '/data/uzbekistan.csv'
};

async function fetchCSVData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.warn(`Could not load CSV from ${url}:`, error.message);
    return [];
  }
}

async function fetchAllData() {
  const countryStats = countryStatisticsData.countries;
  const countries = [];

  const fetchPromises = Object.entries(CSV_ENDPOINTS).map(async ([iso, url]) => {
    const disasters = await fetchCSVData(url);
    return { iso, disasters };
  });

  const results = await Promise.all(fetchPromises);

  results.forEach(({ iso, disasters }) => {
    const stats = countryStats[iso];

    if (stats) {
      countries.push({
        id: stats.id,
        name: stats.name,
        iso: stats.iso,
        coordinates: stats.coordinates,
        statistics: stats.statistics,
        disasters: disasters.map(d => formatDisaster(d))
      });
    }
  });

  countries.sort((a, b) => a.name.localeCompare(b.name));

  return { countries };
}

function formatDisaster(d) {
  return {
    disNo: d.disNo,
    hazardGroup: d.hazardGroup,
    hazardType: d.hazardType,
    specificHazardName: d.specificHazardName,
    iso: d.iso,
    startYear: d.startYear,
    startMonth: d.startMonth,
    startDay: d.startDay,
    endYear: d.endYear,
    endMonth: d.endMonth,
    endDay: d.endDay,
    region: d.region,
    country: d.country,
    totalDeaths: d.totalDeaths,
    noAffected: d.noAffected,
    location: d.location,
    totalEconomicLoss: d.totalEconomicLoss,
    magnitude: d.magnitude,
    magnitudeScale: d.magnitudeScale,
    summary: d.notes || generateSummary(d),
    reliabilityRating: d.reliabilityRating,
    sourceOrigin: d.sourceOrigin,
    sourceWebsite: d.sourceWebsite,
    eventSeason: d.eventSeason,
    glideNumber: d.glideNumber,
    noHousesDamaged: d.noHousesDamaged,
    noHousesDestroyed: d.noHousesDestroyed,
    noHousesDamagedDestroyed: d.noHousesDamagedDestroyed,
    noInfrastructureDestroyedDamaged: d.noInfrastructureDestroyedDamaged
  };
}

function generateSummary(disaster) {
  const parts = [];

  if (disaster.hazardType) {
    parts.push(disaster.hazardType);
  }

  if (disaster.location) {
    parts.push(`in ${disaster.location}`);
  }

  if (disaster.startYear) {
    const month = disaster.startMonth ? getMonthName(disaster.startMonth) : '';
    parts.push(`(${month} ${disaster.startYear})`);
  }

  if (disaster.totalDeaths) {
    parts.push(`- ${disaster.totalDeaths} deaths reported`);
  }

  if (disaster.noAffected) {
    parts.push(`affecting ${formatNumber(disaster.noAffected)} people`);
  }

  return parts.join(' ').trim() || 'No summary available';
}

function getMonthName(month) {
  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month] || '';
}

function formatNumber(num) {
  if (num === null || num === undefined) return '';
  return num.toLocaleString();
}

/**
 * Hook to load and manage disaster data
 */
export function useDisasterData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const parsedData = await fetchAllData();

        if (isMounted) {
          setData(parsedData);
        }
      } catch (err) {
        console.error('Error loading disaster data:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * Hook to get disaster data for a specific country
 * @param {string} iso - Country ISO code
 */
export function useCountryDisasterData(iso) {
  const { data, loading, error } = useDisasterData();
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (data && iso) {
      const country = data.countries.find(c => c.iso === iso);
      setCountryData(country || null);
    }
  }, [data, iso]);

  return { countryData, loading, error };
}

/**
 * Hook to get country statistics data
 */
export function useCountryStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(countryStatisticsData);
    setLoading(false);
  }, []);

  return { stats, loading };
}

/**
 * Hook to fetch disaster data for a single country on-demand
 * @param {string} iso - Country ISO code
 */
export function useLazyCountryData(iso) {
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!iso) return;

    let isMounted = true;

    const loadCountryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = CSV_ENDPOINTS[iso];
        if (!url) {
          throw new Error(`No data endpoint for country: ${iso}`);
        }

        const disasters = await fetchCSVData(url);
        const stats = countryStatisticsData.countries[iso];

        if (!stats) {
          throw new Error(`No statistics for country: ${iso}`);
        }

        if (isMounted) {
          setCountryData({
            id: stats.id,
            name: stats.name,
            iso: stats.iso,
            coordinates: stats.coordinates,
            statistics: stats.statistics,
            disasters: disasters.map(d => formatDisaster(d))
          });
        }
      } catch (err) {
        console.error(`Error loading data for ${iso}:`, err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCountryData();

    return () => {
      isMounted = false;
    };
  }, [iso]);

  return { countryData, loading, error };
}
