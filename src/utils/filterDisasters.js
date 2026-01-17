import { createDisasterDate, parseDateString } from './dateUtils';

/**
 * Filter disasters by date range
 * @param {Array} disasters - Array of disaster objects
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Filtered disasters
 */
export const filterByDateRange = (disasters, startDate, endDate) => {
  let result = disasters;

  if (startDate) {
    const start = parseDateString(startDate);
    result = result.filter((d) => {
      const disasterDate = createDisasterDate(d.startYear, d.startMonth, d.startDay);
      return disasterDate >= start;
    });
  }

  if (endDate) {
    const end = parseDateString(endDate);
    result = result.filter((d) => {
      const disasterDate = createDisasterDate(d.startYear, d.startMonth, d.startDay);
      return disasterDate <= end;
    });
  }

  return result;
};

/**
 * Filter disasters by type
 * @param {Array} disasters - Array of disaster objects
 * @param {Array} disasterTypes - Array of disaster type filter objects with value property
 * @returns {Array} Filtered disasters
 */
export const filterByDisasterTypes = (disasters, disasterTypes) => {
  if (!disasterTypes?.length) return disasters;

  const selectedTypes = disasterTypes.map((t) => t.value.toLowerCase());
  
  return disasters.filter((d) =>
    selectedTypes.some(
      (type) =>
        d.specificHazardName?.toLowerCase().includes(type) ||
        d.hazardType?.toLowerCase().includes(type)
    )
  );
};

/**
 * Apply all filters to disasters array
 * @param {Array} disasters - Array of disaster objects
 * @param {object} filters - Filter object containing startDate, endDate, disasterTypes
 * @returns {Array} Filtered disasters
 */
export const filterDisasters = (disasters, filters) => {
  if (!disasters?.length) return [];

  let result = disasters;

  // Apply date range filter
  result = filterByDateRange(result, filters.startDate, filters.endDate);

  // Apply disaster type filter
  result = filterByDisasterTypes(result, filters.disasterTypes);

  return result;
};

/**
 * Filter countries by region
 * @param {Array} countries - Array of country objects
 * @param {object} regionConfig - Region configuration with countries array
 * @returns {Array} Filtered countries
 */
export const filterCountriesByRegion = (countries, regionConfig) => {
  if (!regionConfig) return countries;
  return countries.filter((country) => regionConfig.countries.includes(country.name));
};

/**
 * Filter countries by specific country name
 * @param {Array} countries - Array of country objects
 * @param {object} countryFilter - Country filter object with label property
 * @returns {Array} Filtered countries
 */
export const filterByCountry = (countries, countryFilter) => {
  if (!countryFilter) return countries;
  return countries.filter(
    (country) => country.name.toLowerCase() === countryFilter.label.toLowerCase()
  );
};
