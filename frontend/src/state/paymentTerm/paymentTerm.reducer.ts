import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewPaymentTerm,
  editPaymentTermById,
  removePaymentTermById,
  searchPaymentTermData,
  updatePaymentTermStatus,
} from './paymentTerm.action';
import type { IPaymentTermMasterState } from './paymentTerm.model';

export const initialState: IPaymentTermMasterState = {
  paymentTermsData: {
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
  createPaymentTerm: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const paymentTermMasterSlice = createSlice({
  name: 'paymentTermMaster',
  initialState,
  reducers: {
    clearPaymentTermMessage: (state) => {
      state.paymentTermsData.message = '';
      state.createPaymentTerm.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPaymentTermData.pending, (state) => {
        state.paymentTermsData.loading = true;
      })
      .addCase(searchPaymentTermData.fulfilled, (state, action) => {
        state.paymentTermsData.data = action.payload.data;
        state.paymentTermsData.message = action.payload.message;
        state.paymentTermsData.loading = false;
        state.paymentTermsData.hasErrors = false;
      })
      .addCase(searchPaymentTermData.rejected, (state, action) => {
        state.paymentTermsData.loading = false;
        state.paymentTermsData.hasErrors = true;
        state.paymentTermsData.message = action.error.message ?? '';
      })

      .addCase(createNewPaymentTerm.pending, (state) => {
        state.createPaymentTerm.loading = true;
      })
      .addCase(createNewPaymentTerm.fulfilled, (state, action) => {
        state.createPaymentTerm.loading = false;
        state.createPaymentTerm.hasErrors = false;
        state.createPaymentTerm.message = action.payload.message;
      })
      .addCase(createNewPaymentTerm.rejected, (state, action) => {
        state.createPaymentTerm.loading = false;
        state.createPaymentTerm.hasErrors = true;
        state.createPaymentTerm.message = action.error.message ?? '';
      })

      .addCase(editPaymentTermById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editPaymentTermById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editPaymentTermById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removePaymentTermById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removePaymentTermById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removePaymentTermById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updatePaymentTermStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updatePaymentTermStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updatePaymentTermStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectPaymentTermMasterRaw = (state: RootState) =>
  state.paymentTermMaster;

export const paymentTermMasterSelector = createSelector(
  [selectPaymentTermMasterRaw],
  (s) => ({
    list: s.paymentTermsData,
    create: s.createPaymentTerm,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearPaymentTermMessage } = paymentTermMasterSlice.actions;

export default paymentTermMasterSlice.reducer;
