/**
 * Chart color palette for data visualization
 */

export const COLORS = {
  black: '#000000',
  darkBlue: '#003366',
  blue11: '#0B387C',
  blue38: '#265F91',
  blue85: '#557799',
  blue170: '#0055AA',
  blue90: '#5A90DA',
  vibrantBlue: '#0088FF',
  brightBlue85: '#55BBFF',
  brightBlue102: '#66C2FF',
  lightBlue: '#EDF4FE',
  blueGrey: '#A8BCCC',
  mapLightBlue: '#D5EDFB',
  mapDarkBlue: '#1E427E',
  greenAccent: '#ABC4BF',
  grey51: '#333333',
  grey64: '#404040',
  grey68: '#444444',
  grey85: '#555555',
  grey102: '#666666',
  grey153: '#999999',
  grey187: '#BBBBBB',
  grey204: '#CCCCCC',
  white: '#FFFFFF',
};

/**
 * Chart color palette for categorical data (DonutChart, BarChart, LineChart, etc.)
 */
export const CHART_COLORS = [
  COLORS.darkBlue,
  COLORS.vibrantBlue,
  COLORS.greenAccent,
  COLORS.blue90,
  COLORS.mapDarkBlue,
  COLORS.brightBlue85,
  COLORS.blue38,
  COLORS.grey64,
  COLORS.blue85,
  COLORS.blueGrey,
  COLORS.brightBlue102,
  COLORS.grey85,
];

/**
 * Disaster type colors with semantic meaning
 */
export const DISASTER_COLORS = {
  Earthquake: COLORS.darkBlue,
  Flood: COLORS.vibrantBlue,
  Fire: COLORS.grey64,
  Storm: COLORS.blue90,
  'Extreme Temperature': COLORS.greenAccent,
  Drought: COLORS.blue85,
  'Mass Movement': COLORS.grey85,
  Tsunami: COLORS.brightBlue85,
  Other: COLORS.blueGrey,
};

/**
 * Line chart colors
 */
export const LINE_COLORS = {
  primary: COLORS.vibrantBlue,
  secondary: COLORS.darkBlue,
  accent: COLORS.greenAccent,
  trend: {
    positive: COLORS.greenAccent,
    negative: COLORS.grey64,
  },
};

/**
 * Comparison chart colors (country vs regional average)
 */
export const COMPARISON_COLORS = {
  primary: COLORS.darkBlue,
  secondary: COLORS.blueGrey,
};
