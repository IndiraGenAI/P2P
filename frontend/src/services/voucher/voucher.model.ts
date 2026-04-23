import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IVoucherList {
  rows: IVoucherDetails[];
  meta: IMetaProps;
}

export interface IVoucherDetails {
  id: number;
  code: string;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IVoucherStatus {
  id: number;
  status?: boolean;
}
