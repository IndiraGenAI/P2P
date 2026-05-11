export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

import type { SortDirection } from '@/common/constants';

export interface SortState<TKey extends string = string> {
  key: TKey | null;
  direction: SortDirection;
}
