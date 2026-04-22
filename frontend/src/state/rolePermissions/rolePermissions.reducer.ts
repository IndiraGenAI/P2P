import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import { saveRolePermissions } from './rolePermissions.action';

interface IRolePermissionsState {
  saveRolePermissions: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
}

export const initialState: IRolePermissionsState = {
  saveRolePermissions: { loading: false, hasErrors: false, message: '' },
};

export const rolePermissionsSlice = createSlice({
  name: 'rolePermissions',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.saveRolePermissions.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRolePermissions.pending, (state) => {
        state.saveRolePermissions.loading = true;
        state.saveRolePermissions.hasErrors = false;
        state.saveRolePermissions.message = '';
      })
      .addCase(saveRolePermissions.fulfilled, (state, action) => {
        state.saveRolePermissions.loading = false;
        state.saveRolePermissions.hasErrors = false;
        state.saveRolePermissions.message = action.payload.message;
      })
      .addCase(saveRolePermissions.rejected, (state, action) => {
        state.saveRolePermissions.loading = false;
        state.saveRolePermissions.hasErrors = true;
        state.saveRolePermissions.message = action.error.message ?? '';
      });
  },
});

export const rolePermissionsSelector = (state: RootState) =>
  state.rolePermissions;
export const { clearMessage } = rolePermissionsSlice.actions;

export default rolePermissionsSlice.reducer;
