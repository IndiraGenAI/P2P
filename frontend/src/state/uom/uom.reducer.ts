import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewUom,
  editUomById,
  removeUomById,
  searchUomData,
  updateUomStatus,
} from './uom.action';
import type { IUomMasterState } from './uom.model';

export const initialState: IUomMasterState = {
  uomsData: {
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
  createUom: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const uomMasterSlice = createSlice({
  name: 'uomMaster',
  initialState,
  reducers: {
    clearUomMessage: (state) => {
      state.uomsData.message = '';
      state.createUom.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUomData.pending, (state) => {
        state.uomsData.loading = true;
      })
      .addCase(searchUomData.fulfilled, (state, action) => {
        state.uomsData.data = action.payload.data;
        state.uomsData.message = action.payload.message;
        state.uomsData.loading = false;
        state.uomsData.hasErrors = false;
      })
      .addCase(searchUomData.rejected, (state, action) => {
        state.uomsData.loading = false;
        state.uomsData.hasErrors = true;
        state.uomsData.message = action.error.message ?? '';
      })

      .addCase(createNewUom.pending, (state) => {
        state.createUom.loading = true;
      })
      .addCase(createNewUom.fulfilled, (state, action) => {
        state.createUom.loading = false;
        state.createUom.hasErrors = false;
        state.createUom.message = action.payload.message;
      })
      .addCase(createNewUom.rejected, (state, action) => {
        state.createUom.loading = false;
        state.createUom.hasErrors = true;
        state.createUom.message = action.error.message ?? '';
      })

      .addCase(editUomById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editUomById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editUomById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeUomById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeUomById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeUomById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateUomStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateUomStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateUomStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectUomMasterRaw = (state: RootState) => state.uomMaster;

export const uomMasterSelector = createSelector(
  [selectUomMasterRaw],
  (s) => ({
    list: s.uomsData,
    create: s.createUom,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearUomMessage } = uomMasterSlice.actions;

export default uomMasterSlice.reducer;
