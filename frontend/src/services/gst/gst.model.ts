import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IGstList {
  rows: IGstDetails[];
  meta: IMetaProps;
}

export interface IGstDetails {
  id: number;
  code: string;
  name: string;
  percentage: number | string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IGstStatus {
  id: number;
  status?: boolean;
}
