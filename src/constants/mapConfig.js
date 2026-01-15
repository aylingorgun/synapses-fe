// Map center and zoom configuration
export const MAP_CONFIG = {
  center: [45.0, 50.0], // Centered between Balkans and Central Asia
  zoom: 4.5,
  minZoom: 3,
  maxZoom: 10,
};

// Tile layer configuration
export const TILE_LAYERS = {
  carto: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

export const GEO_DATA_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Target countries to display
export const TARGET_COUNTRIES = [
  'Albania',
  'Turkey',
  'Tajikistan',
  'Uzbekistan',
  'Georgia',
  'Turkmenistan',
  'Kyrgyzstan',
  'Kazakhstan',
  'Armenia',
  'Moldova',
  'Serbia',
  'Montenegro',
  'Ukraine',
  'Bosnia and Herzegovina',
  'North Macedonia',
  'Belarus',
  'Kosovo',
  'Cyprus',
];

// Border styling
export const BORDER_STYLE = {
  fillColor: '#3388ff',
  weight: 2,
  opacity: 1,
  color: '#3388ff',
  fillOpacity: 0.2,
};
