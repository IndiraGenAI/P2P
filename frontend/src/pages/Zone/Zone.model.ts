export interface IZoneRecord {
  id: number;
  name?: string;
  type?: string;
  code?: string;
  [key: string]: unknown;
}
