const DISASTER_ICON_PATHS = {
  Earthquake: '/icons/Earthquake.svg',
  FlashFlood: '/icons/Flash-flood.svg',
  RiverineFlood: '/icons/Flood.svg',
  CoastalFlood: '/icons/Flood.svg',
  UrbanFlood: '/icons/Flood.svg',
  ForestFires: '/icons/Fire.svg',
  WildFires: '/icons/Fire.svg',
  UrbanFires: '/icons/Fire.svg',
  Heatwave: '/icons/Heatwave.svg',
  Coldwave: '/icons/Cold-wave.svg',
  Freeze: '/icons/Snowfall.svg',
  Windstorm: '/icons/Violent-wind.svg',
  Tornado: '/icons/Tornado.svg',
  Cyclone: '/icons/Cyclone.svg',
  Drought: '/icons/Drought.svg',
  Mudflow: '/icons/Landslide-mudslide.svg',
  Rockfall: '/icons/Landslide-mudslide.svg',
  Landslide: '/icons/Landslide-mudslide.svg',
  SoilErosion: '/icons/Landslide-mudslide.svg',
  Tsunami: '/icons/Tsunami.svg',
  Snowstorm: '/icons/Snowfall.svg',
};

const DEFAULT_ICON_PATH = '/icons/Flood.svg';

export const getDisasterIconPath = (specificHazardName) => {
  return DISASTER_ICON_PATHS[specificHazardName] || DEFAULT_ICON_PATH;
};
