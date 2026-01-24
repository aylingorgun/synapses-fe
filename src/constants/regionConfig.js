export const REGION_CONFIG = {
  western_balkans: {
    name: 'Western Balkans & Türkiye',
    shortName: 'W. Balkans & Türkiye',
    countries: [
      'Albania',
      'Turkey',
      'Cyprus',
      'Serbia',
      'Montenegro',
      'Bosnia and Herzegovina',
      'North Macedonia',
      'Kosovo',
    ],
  },
  eastern_europe: {
    name: 'Eastern Europe Region (EE)',
    shortName: 'Eastern Europe',
    countries: ['Moldova', 'Ukraine', 'Belarus'],
  },
  south_caucasus: {
    name: 'South Caucasus',
    shortName: 'South Caucasus',
    countries: ['Georgia', 'Armenia'],
  },
  central_asia: {
    name: 'Central Asia',
    shortName: 'Central Asia',
    countries: ['Tajikistan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Kazakhstan'],
  },
};

/**
 * Get all countries from all regions
 * @returns {Array} Array of all country names
 */
export const getAllRegionCountries = () => {
  return Object.values(REGION_CONFIG).flatMap((region) => region.countries);
};

/**
 * Find which region a country belongs to
 * @param {string} countryName - Name of the country
 * @returns {string|null} Region key or null if not found
 */
export const getCountryRegion = (countryName) => {
  return (
    Object.keys(REGION_CONFIG).find((key) =>
      REGION_CONFIG[key].countries.includes(countryName)
    ) || null
  );
};

/**
 * Get region config by key
 * @param {string} regionKey - Region key
 * @returns {object|null} Region configuration or null
 */
export const getRegionConfig = (regionKey) => {
  return REGION_CONFIG[regionKey] || null;
};
