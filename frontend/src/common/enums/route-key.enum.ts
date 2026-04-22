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
