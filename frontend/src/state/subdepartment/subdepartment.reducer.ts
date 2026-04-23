import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewSubdepartment,
  editSubdepartmentById,
  removeSubdepartmentById,
  searchSubdepartmentData,
  updateSubdepartmentStatus,
} from './subdepartment.action';
import type { ISubdepartmentMasterState } from './subdepartment.model';

export const initialState: ISubdepartmentMasterState = {
  subdepartmentsData: {
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
  createSubdepartment: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const subdepartmentMasterSlice = createSlice({
  name: 'subdepartmentMaster',
  initialState,
  reducers: {
    clearSubdepartmentMessage: (state) => {
      state.subdepartmentsData.message = '';
      state.createSubdepartment.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSubdepartmentData.pending, (state) => {
        state.subdepartmentsData.loading = true;
      })
      .addCase(searchSubdepartmentData.fulfilled, (state, action) => {
        state.subdepartmentsData.data = action.payload.data;
        state.subdepartmentsData.message = action.payload.message;
        state.subdepartmentsData.loading = false;
        state.subdepartmentsData.hasErrors = false;
      })
      .addCase(searchSubdepartmentData.rejected, (state, action) => {
        state.subdepartmentsData.loading = false;
        state.subdepartmentsData.hasErrors = true;
        state.subdepartmentsData.message = action.error.message ?? '';
      })

      .addCase(createNewSubdepartment.pending, (state) => {
        state.createSubdepartment.loading = true;
      })
      .addCase(createNewSubdepartment.fulfilled, (state, action) => {
        state.createSubdepartment.message = action.payload.message;
        state.createSubdepartment.loading = false;
        state.createSubdepartment.hasErrors = false;
      })
      .addCase(createNewSubdepartment.rejected, (state, action) => {
        state.createSubdepartment.loading = false;
        state.createSubdepartment.hasErrors = true;
        state.createSubdepartment.message = action.error.message ?? '';
      })

      .addCase(editSubdepartmentById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editSubdepartmentById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editSubdepartmentById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateSubdepartmentStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateSubdepartmentStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateSubdepartmentStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeSubdepartmentById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeSubdepartmentById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeSubdepartmentById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const subdepartmentMasterSelector = (state: RootState) =>
  state.subdepartmentMaster;
export const { clearSubdepartmentMessage } = subdepartmentMasterSlice.actions;

export default subdepartmentMasterSlice.reducer;
