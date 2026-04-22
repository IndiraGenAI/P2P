import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICityList {
  rows: ICityDetails[];
  meta: IMetaProps;
}

export interface ICityDetails {
  id: number;
  name: string;
  country_id: number;
  state_id: number;
  status?: boolean;
  country?: { id: number; name: string | null };
  state?: { id: number; name: string | null };
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICityStatus {
  id: number;
  status?: boolean;
}
