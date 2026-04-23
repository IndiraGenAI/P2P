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
  if (value.length <= maxLength) return <span>{value}</span>;
  return (
    <Tooltip
      title={value}
      placement="top"
      mouseEnterDelay={0.15}
      color="#ffffff"
      rootClassName="soft-tooltip"
      styles={{
        body: {
          color: '#374151',
          fontSize: 12,
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 12,
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow:
            '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
          maxWidth: 360,
          wordBreak: 'break-word',
        },
      }}
    >
      <span className="cursor-help underline decoration-dotted decoration-gray-300 underline-offset-4">
        {value.slice(0, maxLength)}…
      </span>
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
