import { IMetaProps } from "src/components/Pagination/Pagination.model";

export interface IRoleRow {
  id: number;
  name: string;
  description?: string;
  status?: boolean;
  [key: string]: unknown;
}

export interface IRole {
  rows: IRoleRow[];
  meta: IMetaProps;
}

export interface IRolePermissionLink {
  page_action?: {
    page?: {
      page_code?: string;
    };
  };
}

export interface IRoleDetails {
  id?: number;
  name: string;
  description?: string;
  status?: boolean;
  role_permissions?: IRolePermissionLink[];
  [key: string]: unknown;
}

export interface IRoleStatus {
  id: number;
  status: boolean;
}

export interface IGetRolePermissions {
  id: number;
  name: string;
  description: string;
  status: boolean;
  pages: unknown[];
  role_permissions: unknown[];
}
