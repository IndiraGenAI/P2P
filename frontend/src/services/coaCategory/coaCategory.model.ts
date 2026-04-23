import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICoaCategoryList {
  rows: ICoaCategoryDetails[];
  meta: IMetaProps;
}

export interface ICoaCategoryDetails {
  id: number;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICoaCategoryStatus {
  id: number;
  status?: boolean;
}
