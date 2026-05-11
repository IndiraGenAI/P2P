import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewPurchaseOrder,
  editPurchaseOrderById,
  fetchPurchaseOrderById,
  removePurchaseOrderById,
  searchPurchaseOrderData,
  submitPurchaseOrderApprovalDecision,
  updatePurchaseOrderStatus,
} from './purchaseOrder.action';
import type { IPurchaseOrderState } from './purchaseOrder.model';

export const initialState: IPurchaseOrderState = {
  list: {
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
  current: { loading: false, hasErrors: false, message: '', data: null },
  create: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
  approvalDecision: { loading: false, hasErrors: false, message: '' },
};

export const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    clearPurchaseOrderMessage: (state) => {
      state.list.message = '';
      state.current.message = '';
      state.create.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
      state.approvalDecision.message = '';
    },
    clearCurrentPurchaseOrder: (state) => {
      state.current.data = null;
      state.current.message = '';
      state.current.hasErrors = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPurchaseOrderData.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(searchPurchaseOrderData.fulfilled, (state, action) => {
        state.list.data = action.payload.data;
        state.list.message = action.payload.message;
        state.list.loading = false;
        state.list.hasErrors = false;
      })
      .addCase(searchPurchaseOrderData.rejected, (state, action) => {
        state.list.loading = false;
        state.list.hasErrors = true;
        state.list.message = action.error.message ?? '';
      })

      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.current.loading = true;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.current.loading = false;
        state.current.hasErrors = false;
        state.current.data = action.payload.data;
        state.current.message = action.payload.message;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
        state.current.loading = false;
        state.current.hasErrors = true;
        state.current.message = action.error.message ?? '';
      })

      .addCase(createNewPurchaseOrder.pending, (state) => {
        state.create.loading = true;
      })
      .addCase(createNewPurchaseOrder.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.hasErrors = false;
        state.create.message = action.payload.message;
      })
      .addCase(createNewPurchaseOrder.rejected, (state, action) => {
        state.create.loading = false;
        state.create.hasErrors = true;
        const fromPayload =
          typeof action.payload === 'string' ? action.payload : '';
        state.create.message =
          fromPayload || action.error.message || 'Could not create purchase order.';
      })

      .addCase(editPurchaseOrderById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editPurchaseOrderById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editPurchaseOrderById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removePurchaseOrderById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removePurchaseOrderById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removePurchaseOrderById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updatePurchaseOrderStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updatePurchaseOrderStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(submitPurchaseOrderApprovalDecision.pending, (state) => {
        state.approvalDecision.loading = true;
      })
      .addCase(submitPurchaseOrderApprovalDecision.fulfilled, (state, action) => {
        state.approvalDecision.loading = false;
        state.approvalDecision.hasErrors = false;
        state.approvalDecision.message = action.payload.message;
      })
      .addCase(submitPurchaseOrderApprovalDecision.rejected, (state, action) => {
        state.approvalDecision.loading = false;
        state.approvalDecision.hasErrors = true;
        const fromPayload =
          typeof action.payload === 'string' ? action.payload : '';
        state.approvalDecision.message =
          fromPayload ||
          action.error.message ||
          'Could not record approval decision.';
      });
  },
});

const selectPurchaseOrderRaw = (state: RootState) => state.purchaseOrder;

export const purchaseOrderSelector = createSelector(
  [selectPurchaseOrderRaw],
  (slice) => ({
    list: slice.list,
    current: slice.current,
    create: slice.create,
    edit: slice.editById,
    remove: slice.removeById,
    status: slice.updateById,
    approvalDecision: slice.approvalDecision,
  }),
);

export const {
  clearPurchaseOrderMessage,
  clearCurrentPurchaseOrder,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
