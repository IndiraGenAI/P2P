import type { KeyboardEvent } from 'react';
import type { AppAbility } from '@/ability';
import type { MenuItem, SelectOption } from '@/common/models';
import {
  EMPTY_DASH,
  INR_CURRENCY_SYMBOL,
} from '@/common/constants/format.constants';

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

/**
 * Formats a numeric value as Indian Rupee (₹) with 2 decimals.
 * Returns `₹0.00` for nullish/NaN values.
 */
export const formatINR = (value: unknown): string => {
  const num = Number(value ?? 0);
  const formatted = Number.isNaN(num)
    ? '0.00'
    : num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return `${INR_CURRENCY_SYMBOL}${formatted}`;
};

/**
 * Formats a date-ish value as a short locale date (e.g. `15 May 2026`).
 * Returns the em-dash placeholder for nullish or invalid dates.
 */
export const formatShortDate = (value: unknown): string => {
  if (!value) return EMPTY_DASH;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return EMPTY_DASH;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

/**
 * Keeps only digits and at most one decimal separator (`.` or `,` → `.`).
 * Useful for sanitising pasted text into amount inputs.
 */
export function sanitizeAmountString(raw: string): string {
  let out = '';
  let dot = false;
  for (const ch of raw.trim()) {
    if (ch >= '0' && ch <= '9') {
      out += ch;
    } else if ((ch === '.' || ch === ',') && !dot) {
      dot = true;
      out += '.';
    }
  }
  return out;
}

/**
 * KeyDown guard for numeric "amount" inputs. Allows digits, a single
 * decimal separator, navigation keys, and standard modifier shortcuts;
 * prevents everything else.
 */
export function allowAmountKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  const { key, currentTarget } = e;
  const allowedNav = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]);
  if (allowedNav.has(key)) {
    return;
  }
  if (key.length !== 1) {
    return;
  }
  if (/^\d$/.test(key)) {
    return;
  }
  const isDecimalKey =
    key === '.' || key === 'Decimal' || key === ',' || key === 'NumpadDecimal';
  if (isDecimalKey) {
    const val = currentTarget.value ?? '';
    const start = currentTarget.selectionStart ?? 0;
    const end = currentTarget.selectionEnd ?? 0;
    const selection = val.slice(start, end);
    const rest = val.slice(0, start) + val.slice(end);
    const sep = /[.,]/;
    if (sep.test(selection) || sep.test(rest)) {
      e.preventDefault();
    }
    return;
  }
  e.preventDefault();
}

export interface FinancialYearOptionsConfig {
  /** Include a leading `{ value: '', label: allLabel }` entry. */
  includeAll?: boolean;
  /** Label for the "all" entry. Default `"All years"`. */
  allLabel?: string;
  /** Years to include before the current FY. Default `3`. */
  back?: number;
  /** Years to include after the current FY. Default `5`. */
  forward?: number;
}

/**
 * Returns Indian financial year options (FY runs April → March), labelled
 * like `2025-26`. Useful for both filters (`includeAll: true`) and add
 * forms (`includeAll: false`).
 */
export function getIndianFinancialYearOptions({
  includeAll = false,
  allLabel = 'All years',
  back = 3,
  forward = 5,
}: FinancialYearOptionsConfig = {}): SelectOption[] {
  const out: SelectOption[] = [];
  if (includeAll) out.push({ value: '', label: allLabel });

  const now = new Date();
  const startYear =
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

  for (let i = -back; i <= forward; i++) {
    const y = startYear + i;
    const label = `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
    out.push({ label, value: label });
  }
  return out;
}

/** Respects `item.end` so `/rate-contract` does not match `/rate-contract/grn`. */
export function menuPathMatches(item: MenuItem, pathname: string): boolean {
  if (!item.to) return false;
  if (pathname === item.to) return true;
  if (item.end === true) return false;
  return pathname.startsWith(item.to + '/');
}

export function canShowMenuItem(
  item: MenuItem,
  ability: AppAbility,
  isCode: string[],
): boolean {
  if (item.children?.length) {
    return item.children.some((child) => canShowMenuItem(child, ability, isCode));
  }
  if (!item.pageCode) return true;
  const action = item.action ?? 'VIEW';
  return ability.can(action, item.pageCode) && isCode.includes(item.pageCode);
}

export function filterMenuTree(
  items: MenuItem[],
  ability: AppAbility,
  isCode: string[],
): MenuItem[] {
  return items
    .filter((item) => canShowMenuItem(item, ability, isCode))
    .map((item) =>
      item.children?.length
        ? {
            ...item,
            children: filterMenuTree(item.children, ability, isCode),
          }
        : item,
    );
}
