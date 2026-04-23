import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewCenter,
  editCenterById,
  removeCenterById,
  searchCenterData,
  updateCenterStatus,
} from './center.action';
import type { ICenterMasterState } from './center.model';

export const initialState: ICenterMasterState = {
  centersData: {
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
  createCenter: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const centerMasterSlice = createSlice({
  name: 'centerMaster',
  initialState,
  reducers: {
    clearCenterMessage: (state) => {
      state.centersData.message = '';
      state.createCenter.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCenterData.pending, (state) => {
        state.centersData.loading = true;
      })
      .addCase(searchCenterData.fulfilled, (state, action) => {
        state.centersData.data = action.payload.data;
        state.centersData.message = action.payload.message;
        state.centersData.loading = false;
        state.centersData.hasErrors = false;
      })
      .addCase(searchCenterData.rejected, (state, action) => {
        state.centersData.loading = false;
        state.centersData.hasErrors = true;
        state.centersData.message = action.error.message ?? '';
      })

      .addCase(createNewCenter.pending, (state) => {
        state.createCenter.loading = true;
      })
      .addCase(createNewCenter.fulfilled, (state, action) => {
        state.createCenter.message = action.payload.message;
        state.createCenter.loading = false;
        state.createCenter.hasErrors = false;
      })
      .addCase(createNewCenter.rejected, (state, action) => {
        state.createCenter.loading = false;
        state.createCenter.hasErrors = true;
        state.createCenter.message = action.error.message ?? '';
      })

      .addCase(editCenterById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCenterById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCenterById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateCenterStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCenterStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCenterStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeCenterById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCenterById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCenterById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const centerMasterSelector = (state: RootState) => state.centerMaster;
export const { clearCenterMessage } = centerMasterSlice.actions;

export default centerMasterSlice.reducer;
