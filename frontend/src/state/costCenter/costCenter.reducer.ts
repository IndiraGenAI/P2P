import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewCostCenter,
  editCostCenterById,
  removeCostCenterById,
  searchCostCenterData,
  updateCostCenterStatus,
} from './costCenter.action';
import type { ICostCenterMasterState } from './costCenter.model';

export const initialState: ICostCenterMasterState = {
  costCentersData: {
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
  createCostCenter: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const costCenterMasterSlice = createSlice({
  name: 'costCenterMaster',
  initialState,
  reducers: {
    clearCostCenterMessage: (state) => {
      state.costCentersData.message = '';
      state.createCostCenter.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCostCenterData.pending, (state) => {
        state.costCentersData.loading = true;
      })
      .addCase(searchCostCenterData.fulfilled, (state, action) => {
        state.costCentersData.data = action.payload.data;
        state.costCentersData.message = action.payload.message;
        state.costCentersData.loading = false;
        state.costCentersData.hasErrors = false;
      })
      .addCase(searchCostCenterData.rejected, (state, action) => {
        state.costCentersData.loading = false;
        state.costCentersData.hasErrors = true;
        state.costCentersData.message = action.error.message ?? '';
      })

      .addCase(createNewCostCenter.pending, (state) => {
        state.createCostCenter.loading = true;
      })
      .addCase(createNewCostCenter.fulfilled, (state, action) => {
        state.createCostCenter.message = action.payload.message;
        state.createCostCenter.loading = false;
        state.createCostCenter.hasErrors = false;
      })
      .addCase(createNewCostCenter.rejected, (state, action) => {
        state.createCostCenter.loading = false;
        state.createCostCenter.hasErrors = true;
        state.createCostCenter.message = action.error.message ?? '';
      })

      .addCase(editCostCenterById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCostCenterById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCostCenterById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateCostCenterStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCostCenterStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCostCenterStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeCostCenterById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCostCenterById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCostCenterById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const costCenterMasterSelector = (state: RootState) =>
  state.costCenterMaster;
export const { clearCostCenterMessage } = costCenterMasterSlice.actions;

export default costCenterMasterSlice.reducer;
