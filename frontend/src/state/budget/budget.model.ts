import type { IBudgetListResult } from 'src/services/budget/budget.model';

export interface IBudgetMasterState {
  budgetsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IBudgetListResult;
  };
  createBudget: { loading: boolean; hasErrors: boolean; message: string };
}
