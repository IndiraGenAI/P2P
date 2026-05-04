import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewPurchaseRequest,
  editPurchaseRequestById,
  fetchPurchaseRequestById,
  removePurchaseRequestById,
  searchPurchaseRequestData,
  submitPurchaseRequestApprovalDecision,
  updatePurchaseRequestStatus,
} from './purchaseRequest.action';
import type { IPurchaseRequestState } from './purchaseRequest.model';

export const initialState: IPurchaseRequestState = {
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

export const purchaseRequestSlice = createSlice({
  name: 'purchaseRequest',
  initialState,
  reducers: {
    clearPurchaseRequestMessage: (state) => {
      state.list.message = '';
      state.current.message = '';
      state.create.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
      state.approvalDecision.message = '';
    },
    clearCurrentPurchaseRequest: (state) => {
      state.current.data = null;
      state.current.message = '';
      state.current.hasErrors = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPurchaseRequestData.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(searchPurchaseRequestData.fulfilled, (state, action) => {
        state.list.data = action.payload.data;
        state.list.message = action.payload.message;
        state.list.loading = false;
        state.list.hasErrors = false;
      })
      .addCase(searchPurchaseRequestData.rejected, (state, action) => {
        state.list.loading = false;
        state.list.hasErrors = true;
        state.list.message = action.error.message ?? '';
      })

      .addCase(fetchPurchaseRequestById.pending, (state) => {
        state.current.loading = true;
      })
      .addCase(fetchPurchaseRequestById.fulfilled, (state, action) => {
        state.current.loading = false;
        state.current.hasErrors = false;
        state.current.data = action.payload.data;
        state.current.message = action.payload.message;
      })
      .addCase(fetchPurchaseRequestById.rejected, (state, action) => {
        state.current.loading = false;
        state.current.hasErrors = true;
        state.current.message = action.error.message ?? '';
      })

      .addCase(createNewPurchaseRequest.pending, (state) => {
        state.create.loading = true;
      })
      .addCase(createNewPurchaseRequest.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.hasErrors = false;
        state.create.message = action.payload.message;
      })
      .addCase(createNewPurchaseRequest.rejected, (state, action) => {
        state.create.loading = false;
        state.create.hasErrors = true;
        const fromPayload =
          typeof action.payload === 'string' ? action.payload : '';
        state.create.message =
          fromPayload || action.error.message || 'Could not create purchase request.';
      })

      .addCase(editPurchaseRequestById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editPurchaseRequestById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editPurchaseRequestById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removePurchaseRequestById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removePurchaseRequestById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removePurchaseRequestById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updatePurchaseRequestStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updatePurchaseRequestStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updatePurchaseRequestStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(submitPurchaseRequestApprovalDecision.pending, (state) => {
        state.approvalDecision.loading = true;
      })
      .addCase(submitPurchaseRequestApprovalDecision.fulfilled, (state, action) => {
        state.approvalDecision.loading = false;
        state.approvalDecision.hasErrors = false;
        state.approvalDecision.message = action.payload.message;
      })
      .addCase(submitPurchaseRequestApprovalDecision.rejected, (state, action) => {
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

const selectPurchaseRequestRaw = (state: RootState) => state.purchaseRequest;

export const purchaseRequestSelector = createSelector(
  [selectPurchaseRequestRaw],
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
  clearPurchaseRequestMessage,
  clearCurrentPurchaseRequest,
} = purchaseRequestSlice.actions;

export default purchaseRequestSlice.reducer;
