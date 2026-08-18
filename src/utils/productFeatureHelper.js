/**
 * Helper function to select the best product card feature display
 * based on priority and availability of actual product specifications.
 */

const INVALID_VALUES = [
  'n/a',
  'na',
  '-',
  'not available',
  'none',
  'null',
  'undefined'
];

export function isInvalidValue(val) {
  if (val === null || val === undefined) return true;
  const str = String(val).trim().toLowerCase();
  if (str === '') return true;
  if (INVALID_VALUES.includes(str)) return true;
  if (str.includes('n/a')) return true;
  return false;
}

export function getProductCardFeature(product) {
  if (!product) {
    return { label: 'Signature Sound', value: 'Signature Sound', displayText: 'Signature Sound' };
  }

  // 1. Check existing USP if it is already valid and not "N/A BATTERY" or invalid
  if (product.usp && !isInvalidValue(product.usp) && product.usp !== 'Signature Sound') {
    const lowerUsp = product.usp.toLowerCase();
    if (!lowerUsp.includes('n/a')) {
      return {
        label: 'USP',
        value: product.usp,
        displayText: product.usp
      };
    }
  }

  const specs = product.specs || {};

  // Define priority search fields: [Label to output, candidate accessor keys/paths]
  const priorities = [
    {
      label: 'Battery Life',
      getValue: () => product.batteryLife || specs['Battery Life'] || specs['BatteryLife'] || specs['batteryLife'] || product.battery_life,
      formatDisplay: (v) => {
        const lower = String(v).toLowerCase();
        return lower.includes('battery') ? v : `${v} Battery`;
      }
    },
    {
      label: 'Connectivity',
      getValue: () => product.connectivity || specs['Connectivity'] || specs['connectivity'] || product.connectivityType,
      formatDisplay: (v) => {
        const lower = String(v).toLowerCase();
        if (lower.includes('bluetooth') || lower.includes('wired') || lower.includes('wireless')) {
          return v;
        }
        return `Connectivity · ${v}`;
      }
    },
    {
      label: 'Water Resistance',
      getValue: () => specs['Water Resistance'] || specs['waterResistance'] || product.waterResistance,
      formatDisplay: (v) => {
        const lower = String(v).toLowerCase();
        return lower.includes('water') || lower.includes('ipx') || lower.includes('proof') ? v : `Water Resistance · ${v}`;
      }
    },
    {
      label: 'Driver Size',
      getValue: () => specs['Driver Size'] || specs['driverSize'] || product.driverSize,
      formatDisplay: (v) => `Driver Size · ${v}`
    },
    {
      label: 'Charging Tech',
      getValue: () => specs['Charging Tech'] || specs['chargingTech'],
      formatDisplay: (v) => v
    },
    {
      label: 'Charging Port',
      getValue: () => specs['Charging Port'] || specs['chargingPort'],
      formatDisplay: (v) => `Port · ${v}`
    },
    {
      label: 'Warranty',
      getValue: () => specs['Warranty'] || specs['warranty'],
      formatDisplay: (v) => v
    },
    {
      label: 'Capacity',
      getValue: () => specs['Capacity'] || specs['capacity'],
      formatDisplay: (v) => `Capacity · ${v}`
    }
  ];

  // Try each prioritized item
  for (const item of priorities) {
    const rawVal = item.getValue();
    if (!isInvalidValue(rawVal)) {
      const valStr = String(rawVal).trim();
      return {
        label: item.label,
        value: valStr,
        displayText: item.formatDisplay(valStr)
      };
    }
  }

  // Fallback: Check remaining specs keys excluding common non-feature metadata
  const skipKeys = ['brand', 'in stock', 'category', 'color', 'price', 'description', 'id', 'name'];
  for (const [key, val] of Object.entries(specs)) {
    if (skipKeys.includes(key.toLowerCase())) continue;
    if (!isInvalidValue(val)) {
      const valStr = String(val).trim();
      return {
        label: key,
        value: valStr,
        displayText: `${key} · ${valStr}`
      };
    }
  }

  // Fallback: Check features array
  if (Array.isArray(product.features) && product.features.length > 0) {
    for (const feat of product.features) {
      if (!isInvalidValue(feat)) {
        return {
          label: 'Feature',
          value: String(feat).trim(),
          displayText: String(feat).trim()
        };
      }
    }
  }

  // Ultimate safe generic fallback
  return {
    label: 'Signature Sound',
    value: 'Signature Sound',
    displayText: 'Signature Sound'
  };
}
