import { createAsyncThunk } from '@reduxjs/toolkit';
import rolePermissionsService from '@/services/rolePermissions/rolePermissions.service';
import type { ISaveRolePermissionsPayload } from '@/services/rolePermissions/rolePermissions.model';

export const saveRolePermissions = createAsyncThunk(
  'rolePermissions/save',
  async (data: ISaveRolePermissionsPayload) => {
    return rolePermissionsService.save(data);
  },
);
