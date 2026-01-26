/**
 * Format a number as currency with appropriate suffix (B/M/K)
 */
export const formatCurrency = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${num.toLocaleString()}`;
  return `$${num}`;
};

/**
 * Format a count with appropriate suffix (M/K)
 */
export const formatCount = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

/**
 * Format population numbers
 */
export const formatPopulation = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  return num.toLocaleString();
};

/**
 * Format area in km²
 */
export const formatArea = (num) => {
  if (num === null || num === undefined) return '—';
  return `${num.toLocaleString()} km²`;
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (num) => {
  if (num === null || num === undefined) return '—';
  return `${num}°C`;
};

/**
 * Get measurement label based on scale type
 */
export const getMeasurementLabel = (scale) => {
  if (!scale) return 'Magnitude';
  
  const labels = {
    'Richter': 'Magnitude',
    'Celsius': 'Temperature',
    'Hectar': 'Area Burned',
    'km/h': 'Wind Speed',
  };
  
  return labels[scale] || 'Magnitude';
};

/**
 * Format measurement value with appropriate unit
 */
export const formatMeasurement = (value, scale = '') => {
  if (value === null || value === undefined) return '—';
  
  switch (scale) {
    case 'Celsius':
      return `${value}°C`;
    case 'Hectar':
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K ha` : `${value} ha`;
    case 'km/h':
      return `${value} km/h`;
    case 'Richter':
      return `${value} Richter`;
    default:
      return scale ? `${value} ${scale}` : `${value}`;
  }
};
