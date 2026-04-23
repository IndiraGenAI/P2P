import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICostCenterList {
  rows: ICostCenterDetails[];
  meta: IMetaProps;
}

export interface ICostCenterDetails {
  id: number;
  code: string;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICostCenterStatus {
  id: number;
  status?: boolean;
}
