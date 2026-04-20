import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import { saveRolePermissions } from "./rolePermissions.action";
import { IRolePermissionsState } from "./rolePermissions.model";

export const initialState: IRolePermissionsState = {
  saveRolePermissions: {
    loading: false,
    hasErrors: false,
    message: "",
    data: 0,
  },
};

export const rolePermissionsSlice = createSlice({
  name: "rolePermissions",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.saveRolePermissions.message = "";
    },
  },
  extraReducers: {
    //get role
    [saveRolePermissions.pending.type]: (state) => {
      state.saveRolePermissions.loading = true;
    },
    [saveRolePermissions.fulfilled.type]: (state, action) => {
      state.saveRolePermissions.data = action.payload.data;
      state.saveRolePermissions.message = action.payload.message;
      state.saveRolePermissions.loading = false;
      state.saveRolePermissions.hasErrors = false;
    },
    [saveRolePermissions.rejected.type]: (state, action) => {
      state.saveRolePermissions.loading = false;
      state.saveRolePermissions.hasErrors = true;
      state.saveRolePermissions.message = action.error.message;
    },
  },
});

// A selector
export const rolePermissionSelector = (state: RootState) =>
  state.rolePermissions;

export const { clearMessage } = rolePermissionsSlice.actions;

// The reducer
export default rolePermissionsSlice.reducer;
