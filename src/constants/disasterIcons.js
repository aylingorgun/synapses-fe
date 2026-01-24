// Generic hazard type icon mappings
const HAZARD_TYPE_ICONS = {
  'Earthquake': '/icons/Earthquake.svg',
  'Flood': '/icons/Flood.svg',
  'Fire': '/icons/Fire.svg',
  'Storm': '/icons/Violent-wind.svg',
  'Extreme Temperature': '/icons/Heatwave.svg',
  'Drought': '/icons/Drought.svg',
  'Mass Movement': '/icons/Landslide-mudslide.svg',
  'Tsunami': '/icons/Tsunami.svg',
};

// Specific hazard name icon mappings (for more precise icons)
const SPECIFIC_HAZARD_ICONS = {
  // Earthquakes
  'Earthquake': '/icons/Earthquake.svg',
  
  // Floods
  'Flash Flood': '/icons/Flash-flood.svg',
  'Riverine Flood': '/icons/Flood.svg',
  'Coastal Flood': '/icons/Flood.svg',
  'Urban Flood': '/icons/Flood.svg',
  
  // Fires
  'Forest Fire': '/icons/Fire.svg',
  'Wildfire': '/icons/Fire.svg',
  'Urban Fire': '/icons/Fire.svg',
  
  // Extreme Temperatures
  'Heatwave': '/icons/Heatwave.svg',
  'Coldwave': '/icons/Cold-wave.svg',
  'Cold Wave': '/icons/Cold-wave.svg',
  'Freeze': '/icons/Snowfall.svg',
  
  // Storms
  'Windstorm': '/icons/Violent-wind.svg',
  'Tornado': '/icons/Tornado.svg',
  'Cyclone': '/icons/Cyclone.svg',
  'Snowstorm': '/icons/Snowfall.svg',
  
  // Mass Movements
  'Landslide': '/icons/Landslide-mudslide.svg',
  'Mudflow': '/icons/Landslide-mudslide.svg',
  'Rockfall': '/icons/Landslide-mudslide.svg',
  'Soil Erosion': '/icons/Landslide-mudslide.svg',
  
  // Others
  'Drought': '/icons/Drought.svg',
  'Tsunami': '/icons/Tsunami.svg',
};

const DEFAULT_ICON_PATH = '/icons/Flood.svg';

/**
 * Get the icon path for a disaster
 * @param {string} specificHazardName - The specific hazard name (e.g., "Flash Flood", "Heatwave")
 * @param {string} hazardType - The generic hazard type (e.g., "Flood", "Extreme Temperature")
 * @returns {string} The path to the icon
 */
export const getDisasterIconPath = (specificHazardName, hazardType) => {
  // First try to match specific hazard name
  if (specificHazardName && SPECIFIC_HAZARD_ICONS[specificHazardName]) {
    return SPECIFIC_HAZARD_ICONS[specificHazardName];
  }
  
  // Fall back to generic hazard type
  if (hazardType && HAZARD_TYPE_ICONS[hazardType]) {
    return HAZARD_TYPE_ICONS[hazardType];
  }
  
  return DEFAULT_ICON_PATH;
};
