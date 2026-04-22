import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface ICountry {
  rows: ICountryDetails[];
  meta: IMetaProps;
}

export interface ICountryDetails {
  id: number;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface ICountryStatus {
  id: number;
  status?: boolean;
}
