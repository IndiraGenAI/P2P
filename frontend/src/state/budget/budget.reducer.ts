import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import { createNewBudget, searchBudgetData } from './budget.action';
import type { IBudgetMasterState } from './budget.model';

const emptyMeta = {
  take: 0,
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const initialState: IBudgetMasterState = {
  budgetsData: {
    loading: false,
    hasErrors: false,
    message: '',
    data: {
      rows: [],
      meta: emptyMeta,
    },
  },
  createBudget: { loading: false, hasErrors: false, message: '' },
};

export const budgetMasterSlice = createSlice({
  name: 'budgetMaster',
  initialState,
  reducers: {
    clearBudgetMessage: (state) => {
      state.budgetsData.message = '';
      state.createBudget.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBudgetData.pending, (state) => {
        state.budgetsData.loading = true;
      })
      .addCase(searchBudgetData.fulfilled, (state, action) => {
        state.budgetsData.data = action.payload.data;
        state.budgetsData.message = action.payload.message;
        state.budgetsData.loading = false;
        state.budgetsData.hasErrors = false;
      })
      .addCase(searchBudgetData.rejected, (state, action) => {
        state.budgetsData.loading = false;
        state.budgetsData.hasErrors = true;
        state.budgetsData.message = action.error.message ?? '';
      })

      .addCase(createNewBudget.pending, (state) => {
        state.createBudget.loading = true;
      })
      .addCase(createNewBudget.fulfilled, (state, action) => {
        state.createBudget.message = action.payload.message;
        state.createBudget.loading = false;
        state.createBudget.hasErrors = false;
      })
      .addCase(createNewBudget.rejected, (state, action) => {
        state.createBudget.loading = false;
        state.createBudget.hasErrors = true;
        state.createBudget.message = action.error.message ?? '';
      });
  },
});

export const budgetMasterSelector = (state: RootState) => state.budgetMaster;
export const { clearBudgetMessage } = budgetMasterSlice.actions;

export default budgetMasterSlice.reducer;
