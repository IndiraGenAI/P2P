import { Tooltip } from 'antd';
import moment from 'moment';

export const trimObject = <T extends object>(obj: T): T => {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const v = (obj as Record<string, unknown>)[key];
    result[key] = typeof v === 'string' ? v.trim() : v;
  }
  return result as T;
};

export const dateFormate = (
  date: string | Date | null | undefined,
  format = 'DD-MMM-YYYY',
): string => {
  if (!date) return '-';
  const m = moment(date);
  return m.isValid() ? m.format(format) : '-';
};

export const showTooltip = (text: string | null | undefined, maxLength = 50) => {
  const value = text ?? '';
  if (value.length <= maxLength) return value;
  return (
    <Tooltip title={value}>
      <span>{value.slice(0, maxLength)}…</span>
    </Tooltip>
  );
};

export const bufferURLEncode = (value: string): string =>
  typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(value))) : value;

export const bufferURLDecode = (value: string): string => {
  try {
    return decodeURIComponent(escape(window.atob(value)));
  } catch {
    return value;
  }
};
