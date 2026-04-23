import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ISubdepartmentList {
  rows: ISubdepartmentDetails[];
  meta: IMetaProps;
}

export interface ISubdepartmentDetails {
  id: number;
  department_id: number;
  name: string;
  code: string;
  status?: boolean;
  department?: { id: number; name: string | null; code?: string | null };
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ISubdepartmentStatus {
  id: number;
  status?: boolean;
}
