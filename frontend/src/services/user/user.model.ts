import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export type UserStatus = "ENABLE" | "DISABLE" | "PENDING";

export interface IUserRoleSummary {
  id: number;
  name: string;
}

export interface IUserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: UserStatus;
  last_seen?: string | null;
  created_date?: string | null;
  modified_date?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  roles?: IUserRoleSummary[];
}

export interface IUser {
  rows: IUserDetails[];
  meta: IMetaProps;
}

export interface IUserCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  status?: UserStatus;
  role_ids?: number[];
}

export interface IUserUpdatePayload {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  status?: UserStatus;
  role_ids?: number[];
}

export interface IUserStatus {
  id: number;
  status: UserStatus;
}
