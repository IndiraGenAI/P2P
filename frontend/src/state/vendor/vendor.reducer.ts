import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewVendor,
  editVendorById,
  removeVendorById,
  searchVendorData,
  updateVendorStatus,
} from './vendor.action';
import type { IVendorMasterState } from './vendor.model';

export const initialState: IVendorMasterState = {
  vendorsData: {
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
  createVendor: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const vendorMasterSlice = createSlice({
  name: 'vendorMaster',
  initialState,
  reducers: {
    clearVendorMessage: (state) => {
      state.vendorsData.message = '';
      state.createVendor.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVendorData.pending, (state) => {
        state.vendorsData.loading = true;
      })
      .addCase(searchVendorData.fulfilled, (state, action) => {
        state.vendorsData.data = action.payload.data;
        state.vendorsData.message = action.payload.message;
        state.vendorsData.loading = false;
        state.vendorsData.hasErrors = false;
      })
      .addCase(searchVendorData.rejected, (state, action) => {
        state.vendorsData.loading = false;
        state.vendorsData.hasErrors = true;
        state.vendorsData.message = action.error.message ?? '';
      })

      .addCase(createNewVendor.pending, (state) => {
        state.createVendor.loading = true;
      })
      .addCase(createNewVendor.fulfilled, (state, action) => {
        state.createVendor.loading = false;
        state.createVendor.hasErrors = false;
        state.createVendor.message = action.payload.message;
      })
      .addCase(createNewVendor.rejected, (state, action) => {
        state.createVendor.loading = false;
        state.createVendor.hasErrors = true;
        state.createVendor.message = action.error.message ?? '';
      })

      .addCase(editVendorById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editVendorById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editVendorById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeVendorById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeVendorById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeVendorById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateVendorStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateVendorStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectVendorMasterRaw = (state: RootState) => state.vendorMaster;

export const vendorMasterSelector = createSelector(
  [selectVendorMasterRaw],
  (s) => ({
    list: s.vendorsData,
    create: s.createVendor,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearVendorMessage } = vendorMasterSlice.actions;

export default vendorMasterSlice.reducer;
