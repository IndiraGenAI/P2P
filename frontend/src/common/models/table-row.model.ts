import type { UserStatus } from '@/common/enums';

/**
 * Generic table row used by data tables. Currently mirrors the User shape
 * with a few legacy display fields still expected by the UI.
 */
export interface TableRow {
  id: number;
  user: string;
  email: string;
  position: string;
  salary: string;
  office: string;
  status: UserStatus;
}
