import type { IBudgetPayload } from '@/services/budget/budget.model';

export interface IBudgetRecord extends IBudgetPayload {
  id: number;
}
