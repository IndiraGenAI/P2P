import type { UserStatus } from '@/common/constants';



export interface TableRow {
  id: number;
  user: string;
  email: string;
  position: string;
  salary: string;
  office: string;
  status: UserStatus;
}
