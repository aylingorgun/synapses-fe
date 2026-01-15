// Map disaster specificHazardName to their corresponding SVG icon paths
export const DISASTER_ICON_PATHS = {
  // Earthquakes
  Earthquake: '/icons/Earthquake.svg',

  // Floods
  FlashFlood: '/icons/Flash-flood.svg',
  RiverineFlood: '/icons/Flood.svg',
  CoastalFlood: '/icons/Flood.svg',
  UrbanFlood: '/icons/Flood.svg',

  // Fires
  ForestFires: '/icons/Fire.svg',
  WildFires: '/icons/Fire.svg',
  UrbanFires: '/icons/Fire.svg',

  // Temperature extremes
  Heatwave: '/icons/Heatwave.svg',
  Coldwave: '/icons/Cold-wave.svg',
  Freeze: '/icons/Snowfall.svg',

  // Wind
  Windstorm: '/icons/Violent-wind.svg',
  Tornado: '/icons/Tornado.svg',
  Cyclone: '/icons/Cyclone.svg',

  // Drought
  Drought: '/icons/Drought.svg',

  // Mass movements
  Mudflow: '/icons/Landslide-mudslide.svg',
  Rockfall: '/icons/Landslide-mudslide.svg',
  Landslide: '/icons/Landslide-mudslide.svg',
  SoilErosion: '/icons/Landslide-mudslide.svg',

  // Other
  Tsunami: '/icons/Tsunami.svg',
  Snowstorm: '/icons/Snowfall.svg',
};

// Default icon for unknown disaster types
export const DEFAULT_ICON_PATH = '/icons/Flood.svg';

// Get icon path for a disaster type
export const getDisasterIconPath = (specificHazardName) => {
  return DISASTER_ICON_PATHS[specificHazardName] || DEFAULT_ICON_PATH;
};
