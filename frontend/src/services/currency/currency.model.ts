import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICurrencyList {
  rows: ICurrencyDetails[];
  meta: IMetaProps;
}

export interface ICurrencyDetails {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICurrencyStatus {
  id: number;
  status?: boolean;
}
