export interface ParsedIngredient {
  original: string;
  quantity: number | null;
  unit: string | null;
  item: string;
  isScalable: boolean;
}

const FRACTION_MAP: Record<string, number> = {
  '1/8': 0.125,
  '1/4': 0.25,
  '1/3': 0.333,
  '3/8': 0.375,
  '1/2': 0.5,
  '5/8': 0.625,
  '2/3': 0.667,
  '3/4': 0.75,
  '7/8': 0.875,
};

const NON_SCALABLE_PATTERNS = [
  /^pinch/i,
  /^dash/i,
  /to taste/i,
  /for garnish/i,
  /for serving/i,
  /for topping/i,
  /for dipping/i,
  /for dusting/i,
  /for frying/i,
  /as needed/i,
  /^some\s/i,
  /^a few\s/i,
];

const UNITS = [
  'cup(s)', 'tbsp(s)', 'tsp(s)', 'oz', 'lb(s)', 'g', 'kg', 'ml', 'l',
  'large', 'medium', 'small', 'sheets?', 'cloves?', 'slices?',
];

const UNIT_PATTERN = new RegExp(`^(${UNITS.map(u => u.replace(/\(s\)/g, '(?:s)?')).join('|')})\\b\\s*`, 'i');

function parseFraction(str: string) {
  // Check if it's a simple fraction like "1/4"
  if (FRACTION_MAP[str]) {
    return FRACTION_MAP[str];
  }

  // Check for mixed numbers like "1 1/2"
  const mixedMatch = str.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const fraction = FRACTION_MAP[mixedMatch[2]];
    if (fraction !== undefined) {
      return whole + fraction;
    }
  }

  // Check for plain fraction
  const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1], 10) / parseInt(fractionMatch[2], 10);
  }

  // Check for decimal or whole number
  const numMatch = str.match(/^(\d+\.?\d*)$/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  return parseFloat(str);
}

export function parseIngredient(ingredient: string): ParsedIngredient {
  const original = ingredient;

  // Check for non-scalable patterns
  for (const pattern of NON_SCALABLE_PATTERNS) {
    if (pattern.test(ingredient)) {
      return {
        original,
        quantity: null,
        unit: null,
        item: ingredient,
        isScalable: false,
      };
    }
  }

  let remaining = ingredient.trim();
  let quantity: number | null = null;
  // let remaining = quantity;
  let unit: string | null = null;

  // Try to match mixed number first (e.g., "1 1/2")
  const mixedMatch = remaining.match(/^(\d+\s+\d+\/\d+)\s*/);
  if (mixedMatch) {
    quantity = parseFraction(mixedMatch[1].trim());
    remaining = remaining.slice(mixedMatch[0].length);
  } else {
    // Try to match fraction (e.g., "1/4")
    const fractionMatch = remaining.match(/^(\d+\/\d+)\s*/);
    if (fractionMatch) {
      quantity = parseFraction(fractionMatch[1]);
      remaining = remaining.slice(fractionMatch[0].length);
    } else {
      // Try to match number with attached unit (e.g., "200g")
      const attachedUnitMatch = remaining.match(/^(\d+\.?\d*)(g|kg|ml|l|oz|lb)\s*/i);
      if (attachedUnitMatch) {
        quantity = parseFloat(attachedUnitMatch[1]);
        unit = attachedUnitMatch[2].toLowerCase();
        remaining = remaining.slice(attachedUnitMatch[0].length);
      } else {
        // Try to match plain number (e.g., "3")
        const numberMatch = remaining.match(/^(\d+\.?\d*)\s*/);
        if (numberMatch) {
          quantity = parseFloat(numberMatch[1]);
          remaining = remaining.slice(numberMatch[0].length);
        }
      }
    }
  }

  // If we found a quantity but no unit yet, try to match unit
  if (quantity !== null && unit === null) {
    const unitMatch = remaining.match(UNIT_PATTERN);
    if (unitMatch) {
      unit = unitMatch[1].toLowerCase();
      remaining = remaining.slice(unitMatch[0].length);
    }
  }

  // If no quantity found, treat as non-scalable
  if (quantity === null) {
    return {
      original,
      quantity: null,
      unit: null,
      item: ingredient,
      isScalable: false,
    };
  }

  return {
    original,
    quantity,
    unit,
    item: remaining.trim(),
    isScalable: true,
  };
}

export function formatQuantity(num: number): string {
  // Handle whole numbers
  if (Number.isInteger(num)) {
    return num.toString();
  }

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Check for common fractions
  const tolerance = 0.02;
  const fractions = [
    { value: 0.125, display: '1/8' },
    { value: 0.25, display: '1/4' },
    { value: 0.333, display: '1/3' },
    { value: 0.375, display: '3/8' },
    { value: 0.5, display: '1/2' },
    { value: 0.625, display: '5/8' },
    { value: 0.667, display: '2/3' },
    { value: 0.75, display: '3/4' },
    { value: 0.875, display: '7/8' },
  ];

  for (const frac of fractions) {
    if (Math.abs(decimal - frac.value) < tolerance) {
      return whole > 0 ? `${whole} ${frac.display}` : frac.display;
    }
  }

  // Fall back to one decimal place
  return num.toFixed(1).replace(/\.0$/, '');
}

export function scaleIngredient(parsed: ParsedIngredient, multiplier: number, minAmount: string): string {
  if (!parsed.isScalable || parsed.quantity === null) {
    return parsed.original;
  }


  let minAmountNum = parseFraction(minAmount);

  const scaledQuantity = minAmountNum * multiplier;
  console.log(`minAmountNum: ${minAmountNum} by multiplier ${multiplier} gives ${scaledQuantity}`);
  const formattedQuantity = formatQuantity(scaledQuantity);

  // // Reconstruct the ingredient string
  // if (parsed.unit) {
  //   // Handle attached units (like "200g")
  //   if (['g', 'kg', 'ml', 'l'].includes(parsed.unit)) {
  //     return `${formattedQuantity}${parsed.unit} ${parsed.item}`;
  //   }
  //   // Handle units with space
  //   return `${formattedQuantity} ${parsed.unit} ${parsed.item}`;
  // }

  return `${formattedQuantity}`;
}
