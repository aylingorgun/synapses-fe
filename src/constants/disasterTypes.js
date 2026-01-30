/**
 * Standard disaster type definitions and normalization utilities
 */

export const DISASTER_TYPES = {
  EARTHQUAKE: 'Earthquake',
  FLOOD: 'Flood',
  FIRE: 'Fire',
  STORM: 'Storm',
  EXTREME_TEMPERATURE: 'Extreme Temperature',
  DROUGHT: 'Drought',
  MASS_MOVEMENT: 'Mass Movement',
  TSUNAMI: 'Tsunami',
  EPIDEMIC: 'Epidemic',
  OTHER: 'Other',
};

export const DISASTER_TYPE_OPTIONS = [
  { value: 'earthquake', label: 'Earthquake' },
  { value: 'flood', label: 'Flood' },
  { value: 'fire', label: 'Fire' },
  { value: 'storm', label: 'Storm' },
  { value: 'extreme_temperature', label: 'Extreme Temperature' },
  { value: 'drought', label: 'Drought' },
  { value: 'mass_movement', label: 'Mass Movement' },
  { value: 'tsunami', label: 'Tsunami' },
  { value: 'epidemic', label: 'Epidemic' },
];

const DISASTER_TYPE_MAPPINGS = {
  'earthquake': DISASTER_TYPES.EARTHQUAKE,
  'flood': DISASTER_TYPES.FLOOD,
  'floods': DISASTER_TYPES.FLOOD,
  'fire': DISASTER_TYPES.FIRE,
  'fires': DISASTER_TYPES.FIRE,
  'wildfire': DISASTER_TYPES.FIRE,
  'wildfires': DISASTER_TYPES.FIRE,
  'forestfire': DISASTER_TYPES.FIRE,
  'forestfires': DISASTER_TYPES.FIRE,
  'storm': DISASTER_TYPES.STORM,
  'storms': DISASTER_TYPES.STORM,
  'windstorm': DISASTER_TYPES.STORM,
  'extremetemperature': DISASTER_TYPES.EXTREME_TEMPERATURE,
  'extremeheat': DISASTER_TYPES.EXTREME_TEMPERATURE,
  'coldwave': DISASTER_TYPES.EXTREME_TEMPERATURE,
  'heatwave': DISASTER_TYPES.EXTREME_TEMPERATURE,
  'drought': DISASTER_TYPES.DROUGHT,
  'droughts': DISASTER_TYPES.DROUGHT,
  'massmovement': DISASTER_TYPES.MASS_MOVEMENT,
  'landslide': DISASTER_TYPES.MASS_MOVEMENT,
  'mudslide': DISASTER_TYPES.MASS_MOVEMENT,
  'tsunami': DISASTER_TYPES.TSUNAMI,
  'epidemic': DISASTER_TYPES.EPIDEMIC,
};

/**
 * Normalize a hazard type string to a standard disaster type
 * @param {string} hazardType - Raw hazard type from data
 * @returns {string} Normalized disaster type
 */
export function normalizeDisasterType(hazardType) {
  if (!hazardType) return DISASTER_TYPES.OTHER;

  // Direct match
  if (Object.values(DISASTER_TYPES).includes(hazardType)) {
    return hazardType;
  }

  // Normalized matching
  const normalized = hazardType.toLowerCase().replace(/[_\s-]/g, '');
  
  if (DISASTER_TYPE_MAPPINGS[normalized]) {
    return DISASTER_TYPE_MAPPINGS[normalized];
  }

  return DISASTER_TYPES.OTHER;
}
