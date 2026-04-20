import { createAsyncThunk } from "@reduxjs/toolkit";
import { IRoleRecord } from "src/pages/Role/Role.model";
import { IRoleDetails, IRoleStatus } from "src/services/role/role.model";
import roleService from "src/services/role/role.service";

export const searchRoleData = createAsyncThunk(
  "role/searchRoleData",
  async (data: any) => {
    return roleService.searchRoleData(data);
  }
);
export const createNewRole = createAsyncThunk(
  "role/createNewRole",
  async (data: IRoleDetails) => {
    return roleService.createNewRole(data);
  }
);
export const editRoleById = createAsyncThunk(
  "role/editRoleById",
  async (data: IRoleRecord) => {
    return roleService.editRoleById(data);
  }
);
export const removeRoleById = createAsyncThunk(
  "role/removeRoleById",
  async (id: number) => {
    return roleService.removeRoleById(id);
  }
);

export const updateRoleStatus = createAsyncThunk(
  "role/updateRoleStatus",
  async (data: IRoleStatus) => {
    return roleService.updateRoleStatus(data);
  }
);

export const getRolePermissions = createAsyncThunk(
  "role/getPermissions",
  async (id: number) => {
    return roleService.getRolePermissions(id);
  }
);
