import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewDepartment,
  editDepartmentById,
  removeDepartmentById,
  searchDepartmentData,
  updateDepartmentStatus,
} from './department.action';
import type { IDepartmentMasterState } from './department.model';

export const initialState: IDepartmentMasterState = {
  departmentsData: {
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
  createDepartment: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const departmentMasterSlice = createSlice({
  name: 'departmentMaster',
  initialState,
  reducers: {
    clearDepartmentMessage: (state) => {
      state.departmentsData.message = '';
      state.createDepartment.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDepartmentData.pending, (state) => {
        state.departmentsData.loading = true;
      })
      .addCase(searchDepartmentData.fulfilled, (state, action) => {
        state.departmentsData.data = action.payload.data;
        state.departmentsData.message = action.payload.message;
        state.departmentsData.loading = false;
        state.departmentsData.hasErrors = false;
      })
      .addCase(searchDepartmentData.rejected, (state, action) => {
        state.departmentsData.loading = false;
        state.departmentsData.hasErrors = true;
        state.departmentsData.message = action.error.message ?? '';
      })

      .addCase(createNewDepartment.pending, (state) => {
        state.createDepartment.loading = true;
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.createDepartment.message = action.payload.message;
        state.createDepartment.loading = false;
        state.createDepartment.hasErrors = false;
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.createDepartment.loading = false;
        state.createDepartment.hasErrors = true;
        state.createDepartment.message = action.error.message ?? '';
      })

      .addCase(editDepartmentById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editDepartmentById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editDepartmentById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateDepartmentStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateDepartmentStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateDepartmentStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeDepartmentById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeDepartmentById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeDepartmentById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const departmentMasterSelector = (state: RootState) =>
  state.departmentMaster;
export const { clearDepartmentMessage } = departmentMasterSlice.actions;

export default departmentMasterSlice.reducer;
