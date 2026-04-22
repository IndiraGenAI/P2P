import type { UserStatus } from '@/common/enums';

export interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  salary: number;
  office: string;
  status: UserStatus;
  avatarUrl?: string;
}

export interface UserFilters {
  position: string;
  office: string;
  status: string;
  minSalary: string;
  maxSalary: string;
}
