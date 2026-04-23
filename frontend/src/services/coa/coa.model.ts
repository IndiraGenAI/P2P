import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICoaList {
  rows: ICoaDetails[];
  meta: IMetaProps;
}

export interface ICoaCategoryRef {
  id: number;
  name: string;
  status?: boolean;
}

export interface ICoaDetails {
  id: number;
  coa_category_id: number;
  coa_category?: ICoaCategoryRef | null;
  gl_code: string;
  gl_name: string;
  distribution_combination: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICoaStatus {
  id: number;
  status?: boolean;
}
