/**
 * Format a date from year, month, day components
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @param {number} day - The day
 * @param {object} options - Intl.DateTimeFormat options override
 * @returns {string} Formatted date string
 */
export const formatDate = (year, month, day, options = {}) => {
  if (!year) return 'Unknown';
  
  const date = new Date(year, (month || 1) - 1, day || 1);
  const defaultOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format a short date (month and year only)
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @param {number} day - The day (optional, used for date creation)
 * @returns {string} Short formatted date string
 */
export const formatShortDate = (year, month, day) => {
  if (!year) return '';
  
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Create a Date object from disaster date components
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @param {number} day - The day
 * @returns {Date} JavaScript Date object
 */
export const createDisasterDate = (year, month, day) => {
  return new Date(year, (month || 1) - 1, day || 1);
};

/**
 * Parse a date string (YYYY-MM-DD format) to Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} JavaScript Date object
 */
export const parseDateString = (dateString) => {
  return new Date(dateString);
};
