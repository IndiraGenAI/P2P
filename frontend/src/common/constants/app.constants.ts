import type { BudgetControlType } from '@/services/budget/budget.model';

export const APP_NAME = 'P2P-ORG';
export const APP_TAGLINE = 'Procure-to-Pay';
export const APP_DESCRIPTION =
  'Streamline your Procure-to-Pay process — from purchase request to payment, all in one place.';
export const COMPANY_NAME = 'P2P-ORG';

export const BUDGET_CONTROL_LABEL: Record<string, string> = {
  HARD_STOP: 'Hard Stop',
  SOFT_WARNING: 'Soft Warning',
  NONE: 'None',
};

export const BUDGET_CONTROL_OPTIONS: { value: BudgetControlType; label: string }[] = [
  { value: 'HARD_STOP', label: 'Hard Stop' },
  { value: 'SOFT_WARNING', label: 'Soft Warning' },
  { value: 'NONE', label: 'None' },
];

export const RoleType = {
  SuperAdmin: 'SUPER_ADMIN',
  Manager: 'MANAGER',
  Purchaser: 'PURCHASER',
  Finance: 'FINANCE',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  [RoleType.SuperAdmin]: 'Super Admin',
  [RoleType.Manager]: 'Manager',
  [RoleType.Purchaser]: 'Purchaser',
  [RoleType.Finance]: 'Finance',
};

export const RouteKey = {
  Dashboard: 'dashboard',
  UserManagement: 'user-management',
  Workflows: 'workflows',
  WorkflowsV2: 'workflows-v2',
  ItemApproval: 'item-approval',
  VendorApproval: 'vendor-approval',
  BudgetApproval: 'budget-approval',
  MastersControl: 'masters-control',
  RoleConfig: 'role-config',
  PurchaseRequest: 'purchase-request',
  RateContract: 'rate-contract',
  PurchaseOrder: 'purchase-order',
  DirectInvoice: 'direct-invoice',
  Budgets: 'budgets',
  Profile: 'profile',
} as const;

export type RouteKey = (typeof RouteKey)[keyof typeof RouteKey];

export type PageKey = RouteKey;

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export const Trend = {
  Up: 'up',
  Down: 'down',
} as const;

export type Trend = (typeof Trend)[keyof typeof Trend];

export const UserStatus = {
  Hired: 'Hired',
  Pending: 'Pending',
  Inactive: 'Inactive',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
