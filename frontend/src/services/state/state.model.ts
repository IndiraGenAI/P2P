import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IStateList {
  rows: IStateDetails[];
  meta: IMetaProps;
}

export interface IStateDetails {
  id: number;
  name: string;
  country_id: number;
  status?: boolean;
  country?: { id: number; name: string | null };
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IStateStatus {
  id: number;
  status?: boolean;
}
