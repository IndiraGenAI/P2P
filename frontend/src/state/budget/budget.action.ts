import { createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '@/services/budget/budget.service';
import type { IBudgetPayload } from '@/services/budget/budget.model';

export const searchBudgetData = createAsyncThunk(
  'budgetMaster/searchBudgetData',
  async (data: unknown) => {
    return budgetService.search(data);
  },
);

export const createNewBudget = createAsyncThunk(
  'budgetMaster/createNewBudget',
  async (data: IBudgetPayload) => {
    return budgetService.create(data);
  },
);
