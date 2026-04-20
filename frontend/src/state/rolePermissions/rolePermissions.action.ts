import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermission } from "../../pages/Permissions/Permission.model";
import rolePermissionsService from "../../services/rolePermissions/rolePermissions.service";

export const saveRolePermissions = createAsyncThunk(
  "rolePermissions/saveRolePermissions",
  async (data: IPermission) => {
    return rolePermissionsService.saveRolePermissions(data);
  }
);
