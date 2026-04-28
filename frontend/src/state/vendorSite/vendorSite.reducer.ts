import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewVendorSite,
  editVendorSiteById,
  removeVendorSiteById,
  searchVendorSiteData,
  updateVendorSiteStatus,
} from './vendorSite.action';
import type { IVendorSiteMasterState } from './vendorSite.model';

export const initialState: IVendorSiteMasterState = {
  vendorSitesData: {
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
  createVendorSite: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const vendorSiteMasterSlice = createSlice({
  name: 'vendorSiteMaster',
  initialState,
  reducers: {
    clearVendorSiteMessage: (state) => {
      state.vendorSitesData.message = '';
      state.createVendorSite.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVendorSiteData.pending, (state) => {
        state.vendorSitesData.loading = true;
      })
      .addCase(searchVendorSiteData.fulfilled, (state, action) => {
        state.vendorSitesData.data = action.payload.data;
        state.vendorSitesData.message = action.payload.message;
        state.vendorSitesData.loading = false;
        state.vendorSitesData.hasErrors = false;
      })
      .addCase(searchVendorSiteData.rejected, (state, action) => {
        state.vendorSitesData.loading = false;
        state.vendorSitesData.hasErrors = true;
        state.vendorSitesData.message = action.error.message ?? '';
      })

      .addCase(createNewVendorSite.pending, (state) => {
        state.createVendorSite.loading = true;
      })
      .addCase(createNewVendorSite.fulfilled, (state, action) => {
        state.createVendorSite.loading = false;
        state.createVendorSite.hasErrors = false;
        state.createVendorSite.message = action.payload.message;
      })
      .addCase(createNewVendorSite.rejected, (state, action) => {
        state.createVendorSite.loading = false;
        state.createVendorSite.hasErrors = true;
        state.createVendorSite.message = action.error.message ?? '';
      })

      .addCase(editVendorSiteById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editVendorSiteById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editVendorSiteById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeVendorSiteById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeVendorSiteById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeVendorSiteById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateVendorSiteStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateVendorSiteStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateVendorSiteStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectVendorSiteMasterRaw = (state: RootState) => state.vendorSiteMaster;

export const vendorSiteMasterSelector = createSelector(
  [selectVendorSiteMasterRaw],
  (s) => ({
    list: s.vendorSitesData,
    create: s.createVendorSite,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearVendorSiteMessage } = vendorSiteMasterSlice.actions;

export default vendorSiteMasterSlice.reducer;
