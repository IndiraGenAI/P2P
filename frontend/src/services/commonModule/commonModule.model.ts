export interface ICommonModuleDetails {
  country: unknown[];
  area: unknown[];
  city: unknown[];
  state: unknown[];
}

export interface ConfigDetails {
  id?: number;
  code?: string;
  key?: string;
  value?: string;
  [key: string]: unknown;
}
