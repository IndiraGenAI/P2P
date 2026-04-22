import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewRole,
  editRoleById,
  getRolePermissions,
  removeRoleById,
  searchRoleData,
  updateRoleStatus,
} from './role.action';
import type { IRoleState } from './role.model';

export const initialState: IRoleState = {
  rolesData: {
    loading: false,
    hasErrors: false,
    message: '',
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
  createRoles: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
  getPermissions: {
    loading: false,
    hasErrors: false,
    message: '',
    data: {
      id: 0,
      name: '',
      description: '',
      status: false,
      pages: [],
      role_permissions: [],
    },
  },
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = '';
      state.updateById.message = '';
      state.editById.message = '';
      state.createRoles.message = '';
      state.rolesData.message = '';
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(searchRoleData.pending, (state) => {
        state.rolesData.loading = true;
      })
      .addCase(searchRoleData.fulfilled, (state, action) => {
        state.rolesData.data = action.payload.data;
        state.rolesData.message = action.payload.message;
        state.rolesData.loading = false;
        state.rolesData.hasErrors = false;
      })
      .addCase(searchRoleData.rejected, (state, action) => {
        state.rolesData.loading = false;
        state.rolesData.hasErrors = true;
        state.rolesData.message = action.error.message ?? '';
      })


      .addCase(createNewRole.pending, (state) => {
        state.createRoles.loading = true;
      })
      .addCase(createNewRole.fulfilled, (state, action) => {
        state.createRoles.message = action.payload.message;
        state.createRoles.loading = false;
        state.createRoles.hasErrors = false;
      })
      .addCase(createNewRole.rejected, (state, action) => {
        state.createRoles.loading = false;
        state.createRoles.hasErrors = true;
        state.createRoles.message = action.error.message ?? '';
      })


      .addCase(editRoleById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editRoleById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editRoleById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })


      .addCase(updateRoleStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateRoleStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateRoleStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })


      .addCase(removeRoleById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeRoleById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeRoleById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })


      .addCase(getRolePermissions.pending, (state) => {
        state.getPermissions.loading = true;
      })
      .addCase(getRolePermissions.fulfilled, (state, action) => {
        state.getPermissions.data = action.payload.data;
        state.getPermissions.loading = false;
        state.getPermissions.hasErrors = false;
        state.getPermissions.message = action.payload.message;
      })
      .addCase(getRolePermissions.rejected, (state, action) => {
        state.getPermissions.loading = false;
        state.getPermissions.hasErrors = true;
        state.getPermissions.message = action.error.message ?? '';
      });
  },
});

export const roleSelector = (state: RootState) => state.role;
export const { clearRemoveMessage } = roleSlice.actions;

export default roleSlice.reducer;
