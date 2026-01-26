import disasterDataJson from '@/data/disasterData.json';
import { REGION_CONFIG, getCountryRegion } from '@/constants/regionConfig';

/**
 * Normalize disaster type to a generic category
 */
const normalizeDisasterType = (hazardType) => {
  if (!hazardType) return 'Other';

  const GENERIC_DISASTER_TYPES = {
    Earthquake: 'Earthquake',
    Flood: 'Flood',
    Fire: 'Fire',
    Storm: 'Storm',
    'Extreme Temperature': 'Extreme Temperature',
    Drought: 'Drought',
    'Mass Movement': 'Mass Movement',
    Tsunami: 'Tsunami',
  };

  if (GENERIC_DISASTER_TYPES[hazardType]) {
    return GENERIC_DISASTER_TYPES[hazardType];
  }

  const normalized = hazardType.toLowerCase().replace(/[_\s-]/g, '');

  const mappings = {
    earthquake: 'Earthquake',
    flood: 'Flood',
    floods: 'Flood',
    fire: 'Fire',
    fires: 'Fire',
    storm: 'Storm',
    storms: 'Storm',
    extremetemperature: 'Extreme Temperature',
    drought: 'Drought',
    massmovement: 'Mass Movement',
    tsunami: 'Tsunami',
  };

  return mappings[normalized] || hazardType;
};

/**
 * API endpoint for country vs regional average comparison
 * GET /api/statistics/country-comparison?country=Turkey
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { country: countryName } = req.query;

  if (!countryName) {
    return res.status(400).json({ error: 'Country parameter is required' });
  }

  const data = disasterDataJson;
  const regionKey = getCountryRegion(countryName);
  if (!regionKey) {
    return res.status(404).json({ error: `Country "${countryName}" not found in any region` });
  }

  const regionConfig = REGION_CONFIG[regionKey];
  const regionCountries = regionConfig.countries;
  const disasterTypeSet = new Set();
  const countryDisasters = {};
  const regionTotalDisasters = {};
  let countriesWithDataInRegion = 0;

  data.countries.forEach((country) => {
    if (!regionCountries.includes(country.name)) return;

    const isSelectedCountry = country.name.toLowerCase() === countryName.toLowerCase();

    if (country.disasters && country.disasters.length > 0) {
      countriesWithDataInRegion++;
    }

    country.disasters.forEach((disaster) => {
      const type = normalizeDisasterType(disaster.hazardType);
      disasterTypeSet.add(type);

      if (isSelectedCountry) {
        countryDisasters[type] = (countryDisasters[type] || 0) + 1;
      }

      regionTotalDisasters[type] = (regionTotalDisasters[type] || 0) + 1;
    });
  });

  const numCountriesInRegion = regionCountries.length;
  const regionalAverage = {};
  Object.keys(regionTotalDisasters).forEach((type) => {
    regionalAverage[type] = Math.round((regionTotalDisasters[type] / numCountriesInRegion) * 10) / 10;
  });

  const disasterTypes = Array.from(disasterTypeSet).sort();
  const countryTotal = Object.values(countryDisasters).reduce((sum, val) => sum + val, 0);
  const regionalAverageTotal = Object.values(regionalAverage).reduce((sum, val) => sum + val, 0);

  return res.status(200).json({
    country: {
      name: countryName,
      disasters: countryDisasters,
      total: countryTotal,
    },
    regionalAverage: {
      name: `${regionConfig.shortName} Avg`,
      regionKey,
      regionName: regionConfig.name,
      regionShortName: regionConfig.shortName,
      disasters: regionalAverage,
      total: Math.round(regionalAverageTotal * 10) / 10,
      countriesInRegion: numCountriesInRegion,
      countriesWithData: countriesWithDataInRegion,
    },
    disasterTypes,
    metadata: {
      regionKey,
      regionName: regionConfig.name,
      countryCount: numCountriesInRegion,
    },
  });
}
