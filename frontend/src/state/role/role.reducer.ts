import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  createNewRole,
  editRoleById,
  getRolePermissions,
  removeRoleById,
  searchRoleData,
  updateRoleStatus,
} from "./role.action";
import { IRoleState } from "./role.model";

export const initialState: IRoleState = {
  rolesData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      rows: [],
      meta: {
        take: 0,
        itemCount: 0,
        pageCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  },
  createRoles: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  editById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  removeById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  updateById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  getPermissions: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      id: 0,
      name: "",
      description: "",
      status: false,
      pages: [],
      role_permissions: [],
    },
  },
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = "";
      state.updateById.message = "";
      state.editById.message = "";
      state.createRoles.message = "";
    },
  },
  extraReducers: {
    //get role
    [searchRoleData.pending.type]: (state) => {
      state.rolesData.loading = true;
    },
    [searchRoleData.fulfilled.type]: (state, action) => {
      state.rolesData.data = action.payload.data;
      state.rolesData.message = action.payload.message;
      state.rolesData.loading = false;
      state.rolesData.hasErrors = false;
    },
    [searchRoleData.rejected.type]: (state, action) => {
      state.rolesData.loading = false;
      state.rolesData.hasErrors = true;
      state.rolesData.message = action.error.message;
    },

    //create role
    [createNewRole.pending.type]: (state) => {
      state.createRoles.loading = true;
    },
    [createNewRole.fulfilled.type]: (state, action) => {
      state.createRoles.message = action.payload.message;
      state.createRoles.hasErrors = action.payload.error;
      state.createRoles.loading = false;
      state.createRoles.hasErrors = false;
    },
    [createNewRole.rejected.type]: (state, action) => {
      state.createRoles.loading = false;
      state.createRoles.hasErrors = true;
      state.createRoles.message = action.error.message;
    },

    //edit role
    [editRoleById.pending.type]: (state) => {
      state.editById.loading = true;
    },
    [editRoleById.fulfilled.type]: (state, action) => {
      state.editById.message = action.payload.message;
      state.editById.loading = false;
      state.editById.hasErrors = false;
    },
    [editRoleById.rejected.type]: (state, action) => {
      state.editById.loading = false;
      state.editById.hasErrors = true;
      state.editById.message = action.error.message;
    },

    //update role
    [updateRoleStatus.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [updateRoleStatus.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [updateRoleStatus.rejected.type]: (state, action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message = action.error.message;
    },

    //Delete role
    [removeRoleById.pending.type]: (state) => {
      state.removeById.loading = true;
    },
    [removeRoleById.fulfilled.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = false;
      state.removeById.message = action.payload.message;
    },
    [removeRoleById.rejected.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = true;
      state.removeById.message = action.error.message;
    },

    //get rolePermissionsById
    [getRolePermissions.pending.type]: (state) => {
      state.getPermissions.loading = true;
    },
    [getRolePermissions.fulfilled.type]: (state, action) => {
      state.getPermissions.data = action.payload.data;
      state.getPermissions.loading = false;
      state.getPermissions.hasErrors = false;
      state.getPermissions.message = action.payload.message;
    },
    [getRolePermissions.rejected.type]: (state, action) => {
      state.getPermissions.loading = false;
      state.getPermissions.hasErrors = true;
      state.getPermissions.message = action.error.message;
    },
  },
});

// A selector
export const roleSelector = (state: RootState) => state.role;

export const { clearRemoveMessage } = roleSlice.actions;

// The reducer
export default roleSlice.reducer;
