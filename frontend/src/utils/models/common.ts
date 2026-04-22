import type { Moment } from "moment";

export interface IApiResponse<T> {
  data: T;
  message: string;
  errors?: string[];
}

export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IWithCount<T> {
  count: number;
  rows: T[];
}

export interface IFormRules {
  [key: string]: any;
}

export type rules = rule_object[] | [];

export interface rule_object {
  action: string;
  subject: string;
}

export interface IDateFilter {
  start_date?: Moment | null;
  end_date?: Moment | null;
  noLimit?: boolean;
  dashboardFacultyFilter?: number | undefined;
  order?: string;
  orederBy?: string;
  globalOnlineSearchFilter? : null | number | undefined
  is_offline?: boolean;
}

export interface ICheckStaus {
  [key: string]: { value: string; label: string; className: string };
}

export type DashboardTabVisibility = {
  student: boolean;
  finance: boolean;
  academics: boolean;
  events: boolean;
};

export interface IOnlineBranchFilter {
  is_online: boolean;
}