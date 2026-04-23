import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IDepartmentList {
  rows: IDepartmentDetails[];
  meta: IMetaProps;
}

export interface IDepartmentDetails {
  id: number;
  name: string;
  code: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IDepartmentStatus {
  id: number;
  status?: boolean;
}
