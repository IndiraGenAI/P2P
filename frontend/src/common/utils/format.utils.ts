/**
 * Strips currency symbols/separators and returns a numeric value.
 * Returns 0 when the input cannot be parsed.
 */
export const parseSalary = (value: string): number =>
  Number(value.replaceAll(/[^0-9.]/g, '')) || 0;

/**
 * Formats a number as US dollars.
 */
export const formatCurrency = (
  amount: number,
  options: Intl.NumberFormatOptions = {},
): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);

/**
 * Pads a number with a leading zero (e.g. 1 → "01").
 */
export const padNumber = (value: number, length = 2): string =>
  String(value).padStart(length, '0');
