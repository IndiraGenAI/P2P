


export const parseSalary = (value: string): number =>
  Number(value.replaceAll(/[^0-9.]/g, '')) || 0;



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



export const padNumber = (value: number, length = 2): string =>
  String(value).padStart(length, '0');
