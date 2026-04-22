import type { IMetaProps } from "@/components/Pagination/Pagination.model";
import type {
  IPage,
  IRolePermission,
} from "@/pages/Permissions/Permission.model";

export interface IRole {
  rows: IRoleDetails[];
  meta: IMetaProps;
}

export interface IRoleDetails {
  id: number;
  name: string;
  description: string;
  status?: boolean;
  type?: string;
  role_permissions?: IRolePermission[];
}

export interface IRoleStatus {
  id: number;
  status?: boolean;
}

export interface IGetRolePermissions extends IRoleDetails {
  pages: IPage[];
  role_permissions: IRolePermission[];
}
