import type { IMetaProps } from "@/components/Pagination/Pagination.model";

export interface IZoneList {
  rows: IZoneDetails[];
  meta: IMetaProps;
}

export interface IZoneDetails {
  id: number;
  name: string;
  country_id: number;
  code?: string | null;
  status?: boolean;
  country?: { id: number; name: string | null };
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IZoneStatus {
  id: number;
  status?: boolean;
}
