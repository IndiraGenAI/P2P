import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IEntityList {
  rows: IEntityDetails[];
  meta: IMetaProps;
}

export interface IEntityDetails {
  id: number;
  code: string;
  name: string;
  business_unit?: string | null;
  legal_entity?: string | null;
  liability_distribution?: string | null;
  prepayment_distribution?: string | null;
  shipping_addresses?: string[] | null;
  billing_addresses?: string[] | null;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IEntityStatus {
  id: number;
  status?: boolean;
}
