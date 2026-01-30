/**
 * CSV Parser Utility for Disaster Data
 * Parses CSV data from API responses and converts to the expected format
 * Handles N/A, null, empty values, and formatting edge cases
 */

/**
 * Parse a CSV string into an array of objects
 * @param {string} csvString - Raw CSV string
 * @returns {Array} Array of parsed disaster objects
 */
export function parseCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return [];
  }

  // Normalize line endings (handle Windows \r\n and Mac \r)
  const normalizedString = csvString.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // First, join multi-line quoted fields into single lines
  const logicalLines = joinMultiLineFields(normalizedString);
  
  if (logicalLines.length < 2) {
    return [];
  }

  // Parse header row - handle potential BOM and trim whitespace
  const headerLine = logicalLines[0].replace(/^\uFEFF/, '').trim();
  const headers = parseCSVLine(headerLine);
  const expectedFields = headers.length;
  
  const results = [];

  for (let i = 1; i < logicalLines.length; i++) {
    const line = logicalLines[i].trim();
    
    // Skip empty lines or lines that are all commas
    if (!line || isEmptyRow(line)) {
      continue;
    }

    const values = parseCSVLine(line, expectedFields);
    
    // Skip if first value (Dis No) is empty - indicates an empty row
    if (!values[0] || values[0].trim() === '') {
      continue;
    }

    const record = {};
    headers.forEach((header, index) => {
      const key = normalizeHeaderKey(header);
      const value = values[index] || '';
      record[key] = parseValue(value, key);
    });

    // Only add valid disaster records
    if (record.disNo && record.disNo.trim() !== '') {
      results.push(formatDisasterRecord(record));
    }
  }

  return results;
}

/**
 * Join multi-line quoted fields into single logical lines
 * Uses a robust approach: only lines starting with valid disaster ID patterns
 * are treated as new records, everything else is a continuation
 * @param {string} csvContent - The normalized CSV content
 * @returns {Array} Array of logical lines
 */
function joinMultiLineFields(csvContent) {
  const lines = csvContent.split('\n');
  const logicalLines = [];
  
  // Pattern for disaster ID: TYPE-YYYYMMDD-REGION-COUNTRY-NUMBER
  // Examples: MET-20240106-WBTC-ALB-0001, HYDRO-20250702-WBTC-SRB-0001, GEO-20231225-...
  const disasterIdPattern = /^[A-Z]{2,6}-\d{8}-[A-Z]{2,6}-[A-Z]{2,3}-\d{4}/;
  
  let currentLine = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Header line (first line)
    if (i === 0) {
      logicalLines.push(line);
      continue;
    }
    
    // Check if this line starts a new record
    if (disasterIdPattern.test(line)) {
      // Save previous line if exists
      if (currentLine) {
        logicalLines.push(currentLine);
      }
      currentLine = line;
    } else {
      // This is a continuation line - append to current
      if (currentLine) {
        // Replace newline with space to avoid breaking CSV structure
        currentLine += ' ' + line;
      }
      // If no current line and this isn't a record start, skip it
      // (could be empty line or garbage before first record)
    }
  }
  
  // Don't forget the last line
  if (currentLine) {
    logicalLines.push(currentLine);
  }
  
  return logicalLines;
}

/**
 * Parse a single CSV line handling quoted fields with commas
 * Handles improperly escaped quotes by being lenient
 * @param {string} line - CSV line
 * @param {number} expectedFields - Expected number of fields (optional)
 * @returns {Array} Array of field values
 */
function parseCSVLine(line, expectedFields = 0) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let fieldStart = true;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (fieldStart && !inQuotes) {
        // Starting a quoted field
        inQuotes = true;
        fieldStart = false;
      } else if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else if (inQuotes && (nextChar === ',' || nextChar === undefined || nextChar === '\n' || nextChar === '\r')) {
        // End of quoted field (quote followed by comma or end of line)
        inQuotes = false;
      } else if (inQuotes) {
        // Quote in middle of field - treat as literal (handles unescaped quotes in notes)
        current += '"';
      } else {
        // Quote outside of quoted context
        current += '"';
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      fieldStart = true;
    } else {
      current += char;
      fieldStart = false;
    }
  }

  // Push the last field
  result.push(current.trim());

  // If we have more fields than expected, combine extras into the last expected field
  // This handles cases where notes contain unescaped commas and quotes
  if (expectedFields > 0 && result.length > expectedFields) {
    const extraFields = result.splice(expectedFields - 1);
    result.push(extraFields.join(','));
  }

  return result;
}

/**
 * Check if a row is empty (all commas or whitespace)
 * @param {string} line - CSV line
 * @returns {boolean}
 */
function isEmptyRow(line) {
  return line.replace(/,/g, '').trim() === '';
}

/**
 * Normalize header keys to camelCase
 * @param {string} header - Original header name
 * @returns {string} Normalized key
 */
function normalizeHeaderKey(header) {
  const headerMap = {
    'Dis No': 'disNo',
    'Hazard  Group': 'hazardGroup',
    'Hazard Group': 'hazardGroup',
    'Hazard Type': 'hazardType',
    'Specific Hazard Name': 'specificHazardName',
    'Hazard Type Final': 'hazardTypeFinal',
    'ISO': 'iso',
    'Data Source Type': 'dataSourceType',
    'Source Level': 'sourceLevel',
    'Source Origin': 'sourceOrigin',
    'Reliability Rating': 'reliabilityRating',
    'Start Year': 'startYear',
    'Start Month': 'startMonth',
    'Start Day': 'startDay',
    'End Year': 'endYear',
    'End Month': 'endMonth',
    'End Day': 'endDay',
    'Event Season': 'eventSeason',
    'Data Entry Date': 'dataEntryDate',
    'Data Last Updated': 'dataLastUpdated',
    'Magnitude': 'magnitude',
    'Magnitude Scale': 'magnitudeScale',
    'Region': 'region',
    'Country': 'country',
    'Total Deaths': 'totalDeaths',
    'No. Affected': 'noAffected',
    'Location': 'location',
    'Total Economic Loss': 'totalEconomicLoss',
    'No. Houses Damaged/Destroyed': 'noHousesDamagedDestroyed',
    'No. Houses Damaged': 'noHousesDamaged',
    'No. Houses Destroyed': 'noHousesDestroyed',
    'No. Infrastucture Destroyed/Damaged': 'noInfrastructureDestroyedDamaged',
    'Gender Data Availability': 'genderDataAvailability',
    'No.Gender Female': 'noGenderFemale',
    'No.Gender Male': 'noGenderMale',
    'No. Gender Other': 'noGenderOther',
    'No. Children': 'noChildren',
    'No. Disabled Population': 'noDisabledPopulation',
    'Glide Number': 'glideNumber',
    'Source Website': 'sourceWebsite',
    'Complimentry Resources': 'complimentaryResources',
    'Notes': 'notes',
    'Comments': 'comments'
  };

  return headerMap[header.trim()] || toCamelCase(header);
}

/**
 * Convert string to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^./, (chr) => chr.toLowerCase());
}

/**
 * Parse and clean a value, handling N/A, null, empty, and numeric formatting
 * @param {string} value - Raw value from CSV
 * @param {string} key - The field key for type inference
 * @returns {*} Parsed value
 */
function parseValue(value, key) {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return null;
  }

  // Trim whitespace
  const trimmed = String(value).trim();

  // Handle empty values and N/A variations
  if (
    trimmed === '' ||
    trimmed.toLowerCase() === 'n/a' ||
    trimmed === '#N/A' ||
    trimmed.toLowerCase() === 'na' ||
    trimmed.toLowerCase() === 'null' ||
    trimmed === '-'
  ) {
    return null;
  }

  // Numeric fields
  const numericFields = [
    'startYear', 'startMonth', 'startDay',
    'endYear', 'endMonth', 'endDay',
    'totalDeaths', 'noAffected', 'totalEconomicLoss',
    'noHousesDamagedDestroyed', 'noHousesDamaged', 'noHousesDestroyed',
    'noGenderFemale', 'noGenderMale', 'noGenderOther',
    'noChildren', 'noDisabledPopulation',
    'magnitude', 'sourceLevel', 'dataSourceType'
  ];

  if (numericFields.includes(key)) {
    return parseNumericValue(trimmed);
  }

  return trimmed;
}

/**
 * Parse numeric values, handling comma separators and currency symbols
 * @param {string} value - Value to parse
 * @returns {number|null} Parsed number or null
 */
function parseNumericValue(value) {
  if (!value) return null;

  // Remove currency symbols, spaces, and handle comma separators
  let cleaned = String(value)
    .replace(/[$€£¥]/g, '')
    .replace(/\s/g, '')
    .replace(/,/g, '');

  // Handle values with USD or other currency suffixes
  cleaned = cleaned.replace(/USD$/i, '').trim();

  // Try to parse as number
  const num = parseFloat(cleaned);

  if (isNaN(num)) {
    return null;
  }

  // Return integer if it's a whole number
  return Number.isInteger(num) ? parseInt(cleaned, 10) : num;
}

/**
 * Format disaster record to match expected schema
 * @param {Object} record - Raw parsed record
 * @returns {Object} Formatted disaster record
 */
function formatDisasterRecord(record) {
  return {
    disNo: record.disNo || '',
    hazardGroup: normalizeHazardGroup(record.hazardGroup),
    hazardType: normalizeHazardType(record.hazardType, record.hazardTypeFinal),
    specificHazardName: record.specificHazardName || record.hazardType || '',
    hazardTypeFinal: record.hazardTypeFinal || '',
    iso: record.iso || '',
    dataSourceType: record.dataSourceType,
    sourceLevel: record.sourceLevel,
    sourceOrigin: record.sourceOrigin || '',
    reliabilityRating: record.reliabilityRating || '',
    startYear: record.startYear,
    startMonth: record.startMonth,
    startDay: record.startDay,
    endYear: record.endYear,
    endMonth: record.endMonth,
    endDay: record.endDay,
    eventSeason: record.eventSeason || '',
    region: record.region || '',
    country: record.country || '',
    totalDeaths: record.totalDeaths,
    noAffected: record.noAffected,
    location: record.location || '',
    totalEconomicLoss: record.totalEconomicLoss,
    noHousesDamagedDestroyed: record.noHousesDamagedDestroyed,
    noHousesDamaged: record.noHousesDamaged,
    noHousesDestroyed: record.noHousesDestroyed,
    noInfrastructureDestroyedDamaged: record.noInfrastructureDestroyedDamaged || '',
    magnitude: record.magnitude,
    magnitudeScale: record.magnitudeScale || '',
    glideNumber: record.glideNumber || '',
    sourceWebsite: record.sourceWebsite || '',
    notes: record.notes || record.comments || ''
  };
}

/**
 * Normalize hazard group names for consistency
 * @param {string} hazardGroup - Raw hazard group
 * @returns {string} Normalized hazard group
 */
function normalizeHazardGroup(hazardGroup) {
  if (!hazardGroup) return '';
  
  const groupMap = {
    'hydrologicalhazards': 'HydrologicalHazards',
    'meteorologicalhazards': 'MeteorologicalHazards',
    'geophysicalhazards': 'GeophysicalHazards',
    'climatologicalhazards': 'ClimatologicalHazards',
    'biologicalhazards': 'BiologicalHazards'
  };

  const normalized = hazardGroup.toLowerCase().replace(/\s/g, '');
  return groupMap[normalized] || hazardGroup;
}

/**
 * Normalize hazard type for display - ONLY returns valid standardized types
 * @param {string} hazardType - Raw hazard type (from CSV "Hazard Type" column)
 * @param {string} hazardTypeFinal - Final hazard type classification (from CSV "Hazard Type Final" column)
 * @returns {string} Normalized hazard type - one of the valid types or 'Other'
 */
function normalizeHazardType(hazardType, hazardTypeFinal) {
  // Valid standardized disaster types (from Hazard Type Final column)
  const typeMap = {
    'flood': 'Flood',
    'earthquake': 'Earthquake',
    'drought': 'Drought',
    'fire': 'Fire',
    'storm': 'Storm',
    'epidemic': 'Epidemic',
    'extreme_temperature': 'Extreme Temperature',
    'mass_movement': 'Mass Movement',
    'landslide': 'Mass Movement', // Map landslide to mass_movement
    'tsunami': 'Tsunami',
    'volcanic_activity': 'Other'
  };

  // First try hazardTypeFinal (the standardized classification)
  if (hazardTypeFinal) {
    const final = hazardTypeFinal.toLowerCase().trim();
    if (typeMap[final]) {
      return typeMap[final];
    }
  }

  // Fallback: try to infer from hazardType if hazardTypeFinal is missing/invalid
  if (hazardType) {
    const type = hazardType.toLowerCase().trim();
    // Check direct match
    if (typeMap[type]) {
      return typeMap[type];
    }
    // Check if any key is contained in the hazardType
    for (const [key, value] of Object.entries(typeMap)) {
      if (type.includes(key)) {
        return value;
      }
    }
  }

  // If nothing matches, return 'Other'
  return 'Other';
}

/**
 * Group disasters by country ISO code
 * @param {Array} disasters - Array of disaster records
 * @returns {Object} Object with ISO codes as keys and disaster arrays as values
 */
export function groupDisastersByCountry(disasters) {
  const grouped = {};

  disasters.forEach(disaster => {
    const iso = disaster.iso;
    if (!iso) return;

    if (!grouped[iso]) {
      grouped[iso] = [];
    }
    grouped[iso].push(disaster);
  });

  return grouped;
}

/**
 * Merge multiple CSV datasets into a single array
 * @param {Array<string>} csvStrings - Array of CSV strings
 * @returns {Array} Merged array of disaster records
 */
export function mergeCSVDatasets(csvStrings) {
  const allDisasters = [];

  csvStrings.forEach(csv => {
    const disasters = parseCSV(csv);
    allDisasters.push(...disasters);
  });

  // Sort by start year descending (most recent first)
  return allDisasters.sort((a, b) => {
    const yearA = a.startYear || 0;
    const yearB = b.startYear || 0;
    return yearB - yearA;
  });
}

export default {
  parseCSV,
  groupDisastersByCountry,
  mergeCSVDatasets
};
