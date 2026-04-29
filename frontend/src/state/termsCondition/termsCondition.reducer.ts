import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewTermsCondition,
  editTermsConditionById,
  removeTermsConditionById,
  searchTermsConditionData,
  updateTermsConditionStatus,
} from './termsCondition.action';
import type { ITermsConditionMasterState } from './termsCondition.model';

export const initialState: ITermsConditionMasterState = {
  termsConditionsData: {
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
  createTermsCondition: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const termsConditionMasterSlice = createSlice({
  name: 'termsConditionMaster',
  initialState,
  reducers: {
    clearTermsConditionMessage: (state) => {
      state.termsConditionsData.message = '';
      state.createTermsCondition.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTermsConditionData.pending, (state) => {
        state.termsConditionsData.loading = true;
      })
      .addCase(searchTermsConditionData.fulfilled, (state, action) => {
        state.termsConditionsData.data = action.payload.data;
        state.termsConditionsData.message = action.payload.message;
        state.termsConditionsData.loading = false;
        state.termsConditionsData.hasErrors = false;
      })
      .addCase(searchTermsConditionData.rejected, (state, action) => {
        state.termsConditionsData.loading = false;
        state.termsConditionsData.hasErrors = true;
        state.termsConditionsData.message = action.error.message ?? '';
      })

      .addCase(createNewTermsCondition.pending, (state) => {
        state.createTermsCondition.loading = true;
      })
      .addCase(createNewTermsCondition.fulfilled, (state, action) => {
        state.createTermsCondition.loading = false;
        state.createTermsCondition.hasErrors = false;
        state.createTermsCondition.message = action.payload.message;
      })
      .addCase(createNewTermsCondition.rejected, (state, action) => {
        state.createTermsCondition.loading = false;
        state.createTermsCondition.hasErrors = true;
        state.createTermsCondition.message = action.error.message ?? '';
      })

      .addCase(editTermsConditionById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editTermsConditionById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editTermsConditionById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeTermsConditionById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeTermsConditionById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeTermsConditionById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateTermsConditionStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateTermsConditionStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateTermsConditionStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectTermsConditionMasterRaw = (state: RootState) =>
  state.termsConditionMaster;

export const termsConditionMasterSelector = createSelector(
  [selectTermsConditionMasterRaw],
  (s) => ({
    list: s.termsConditionsData,
    create: s.createTermsCondition,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearTermsConditionMessage } = termsConditionMasterSlice.actions;

export default termsConditionMasterSlice.reducer;
