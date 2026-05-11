import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export type BudgetType = 'OPEX' | 'CAPEX';
export type BudgetControlType = 'HARD_STOP' | 'SOFT_WARNING' | 'NONE';

export interface IBudgetFkCoa {
  id: number;
  gl_code: string;
  gl_name: string;
}

export interface IBudgetFkDepartment {
  id: number;
  name: string;
  code: string;
}

export interface IBudgetFkSubdepartment {
  id: number;
  name: string;
  code: string;
  department_id: number;
}

export interface IBudgetFkEntity {
  id: number;
  code: string;
  name: string;
}

export interface IBudgetFkCenter {
  id: number;
  code: string;
  name: string;
}

export interface IBudgetFkCostCenter {
  id: number;
  code: string;
  name: string;
}

export interface IBudgetRow {
  id: number;
  financial_year: string;
  budget_type: BudgetType | string;
  coa_id: number;
  department_id: number;
  subdepartment_id: number;
  entity_id: number;
  center_id: number;
  cost_center_id: number;
  amount: number | string;
  consumed_amount?: number | string | null;
  balance_amount?: number | string | null;
  control_type: BudgetControlType | string;
  created_date?: string | Date | null;
  coa?: IBudgetFkCoa;
  department?: IBudgetFkDepartment;
  subdepartment?: IBudgetFkSubdepartment;
  entity?: IBudgetFkEntity;
  center?: IBudgetFkCenter;
  cost_center?: IBudgetFkCostCenter;
}

export interface IBudgetListResult {
  rows: IBudgetRow[];
  meta: IMetaProps;
}

export interface IBudgetPayload {
  financial_year: string;
  budget_type: BudgetType | string;
  coa_id: number;
  department_id: number;
  subdepartment_id: number;
  entity_id: number;
  center_id: number;
  cost_center_id: number;
  amount: number;
  control_type: BudgetControlType | string;
}
