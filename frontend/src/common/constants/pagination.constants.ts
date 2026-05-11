import type { SelectOption } from '@/common/models';

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS: SelectOption[] = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

/**
 * URL search-param keys that are reserved for table state (paging, sorting)
 * and should NOT be treated as user-applied filters.
 */
export const RESERVED_QUERY_KEYS: ReadonlySet<string> = new Set([
  'take',
  'skip',
  'orderBy',
  'order',
]);
