import type { IRole, IGetRolePermissions } from "src/services/role/role.model";

export interface IRoleState {
  rolesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IRole;
  };
  createRoles: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  getPermissions: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IGetRolePermissions;
  };
}
