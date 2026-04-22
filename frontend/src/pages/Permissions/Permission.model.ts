


export type CheckboxValueType = string | number | boolean;

export interface IPermission {
  page_action_ids: CheckboxValueType[];
  role_id: number;
  created_by: number | null;
}

export interface module {
  id: number;
  page_code: string;
  name: string;
  parent_page_id: number;
  active: boolean;
  page_actions: IPageAction[];
}

export interface subModule {
  id: number;
  page_code: string;
  name: string;
  parent_page_id: any;
  active: boolean;
  page_actions: IPageAction[];
}

export interface IRolePermission {
  id: number;
  role_id: number;
  page_action_id: number;
  created_by: number;
  created_date: string;
  page_action: IPageAction;
}

export interface IPageAction {
  id: number;
  page_id: number;
  action_id: number;
  tag: string;
  page: IPage;
  action: IAction;
}

export interface IPage {
  id: number;
  page_code: string;
  name: string;
  parent_page_id: number | null;
  active: boolean;
  sequence?: number | null;
  page_actions: IPageAction[];
}

export interface IAction {
  id: number;
  action_code: string;
  name: string;
}
