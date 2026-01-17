export const REGION_CONFIG = {
  western_balkans_turkiye_cyprus: {
    name: 'Western Balkans & Türkiye & Cyprus',
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
  south_caucasus_western_cis: {
    name: 'South Caucasus & Western CIS',
    shortName: 'S. Caucasus & W. CIS',
    countries: ['Georgia', 'Armenia', 'Moldova', 'Ukraine', 'Belarus'],
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
