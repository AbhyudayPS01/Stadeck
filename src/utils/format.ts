/** Grouped-digit formatter for stat values; en-US to match the English UI chrome. */
const COUNT_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/**
 * Formats a count for display with digit grouping, e.g. 214000 → "214,000".
 *
 * @param value The number to format; rounded to a whole number.
 * @returns The grouped string.
 */
export function formatCount(value: number): string {
  return COUNT_FORMAT.format(value);
}
