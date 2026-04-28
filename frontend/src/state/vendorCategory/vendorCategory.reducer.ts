import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewVendorCategory,
  editVendorCategoryById,
  removeVendorCategoryById,
  searchVendorCategoryData,
  updateVendorCategoryStatus,
} from './vendorCategory.action';
import type { IVendorCategoryMasterState } from './vendorCategory.model';

export const initialState: IVendorCategoryMasterState = {
  vendorCategoriesData: {
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
  createVendorCategory: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const vendorCategoryMasterSlice = createSlice({
  name: 'vendorCategoryMaster',
  initialState,
  reducers: {
    clearVendorCategoryMessage: (state) => {
      state.vendorCategoriesData.message = '';
      state.createVendorCategory.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVendorCategoryData.pending, (state) => {
        state.vendorCategoriesData.loading = true;
      })
      .addCase(searchVendorCategoryData.fulfilled, (state, action) => {
        state.vendorCategoriesData.data = action.payload.data;
        state.vendorCategoriesData.message = action.payload.message;
        state.vendorCategoriesData.loading = false;
        state.vendorCategoriesData.hasErrors = false;
      })
      .addCase(searchVendorCategoryData.rejected, (state, action) => {
        state.vendorCategoriesData.loading = false;
        state.vendorCategoriesData.hasErrors = true;
        state.vendorCategoriesData.message = action.error.message ?? '';
      })

      .addCase(createNewVendorCategory.pending, (state) => {
        state.createVendorCategory.loading = true;
      })
      .addCase(createNewVendorCategory.fulfilled, (state, action) => {
        state.createVendorCategory.loading = false;
        state.createVendorCategory.hasErrors = false;
        state.createVendorCategory.message = action.payload.message;
      })
      .addCase(createNewVendorCategory.rejected, (state, action) => {
        state.createVendorCategory.loading = false;
        state.createVendorCategory.hasErrors = true;
        state.createVendorCategory.message = action.error.message ?? '';
      })

      .addCase(editVendorCategoryById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editVendorCategoryById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editVendorCategoryById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeVendorCategoryById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeVendorCategoryById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeVendorCategoryById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateVendorCategoryStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateVendorCategoryStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateVendorCategoryStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectVendorCategoryMasterRaw = (state: RootState) =>
  state.vendorCategoryMaster;

export const vendorCategoryMasterSelector = createSelector(
  [selectVendorCategoryMasterRaw],
  (s) => ({
    list: s.vendorCategoriesData,
    create: s.createVendorCategory,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearVendorCategoryMessage } = vendorCategoryMasterSlice.actions;

export default vendorCategoryMasterSlice.reducer;
