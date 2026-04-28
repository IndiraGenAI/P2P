export interface IRolePermissionsBlockState {
  loading: boolean;
  hasErrors: boolean;
  message: string;
}

export interface IRolePermissionsState {
  saveRolePermissions: IRolePermissionsBlockState;
}
