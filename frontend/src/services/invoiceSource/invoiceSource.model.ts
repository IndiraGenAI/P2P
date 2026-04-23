import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IInvoiceSourceList {
  rows: IInvoiceSourceDetails[];
  meta: IMetaProps;
}

export interface IInvoiceSourceDetails {
  id: number;
  code: string;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IInvoiceSourceStatus {
  id: number;
  status?: boolean;
}
