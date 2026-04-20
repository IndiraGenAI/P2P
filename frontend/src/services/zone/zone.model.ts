import { IMetaProps } from "src/components/Pagination/Pagination.model";

export interface IZoneRow {
  id: number;
  name: string;
  type?: string;
  code?: string;
  branches?: { id: number; code: string; name?: string }[];
  [key: string]: unknown;
}

export interface IZone {
  rows: IZoneRow[];
  meta: IMetaProps;
}

export interface IZoneDetails {
  id: number;
  name: string;
  type?: string;
  parent_id?: number;
  branches?: { id: number; code: string; name?: string }[];
}

export interface IZoneStatus {
  id: number;
  status: string;
}

export interface ISearchAllZoneDataPayload {
  [key: string]: unknown;
}
