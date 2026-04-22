import { RouteKey } from '@/common/enums';

export const PAGE_TITLES: Record<RouteKey, string> = {
  [RouteKey.Dashboard]: 'Dashboard',
  [RouteKey.UserManagement]: 'User Management',
  [RouteKey.Workflows]: 'Workflows',
  [RouteKey.WorkflowsV2]: 'Workflow (V2)',
  [RouteKey.ItemApproval]: 'Item Approval',
  [RouteKey.VendorApproval]: 'Vendor Approval',
  [RouteKey.BudgetApproval]: 'Budget Approval',
  [RouteKey.MastersControl]: 'Masters Control',
  [RouteKey.RoleConfig]: 'Role Config',
  [RouteKey.PurchaseRequest]: 'Purchase Request',
  [RouteKey.RateContract]: 'Rate Contract',
  [RouteKey.PurchaseOrder]: 'Purchase Order',
  [RouteKey.DirectInvoice]: 'Direct Invoice',
  [RouteKey.Budgets]: 'Budgets',
  [RouteKey.Profile]: 'Profile',
};

export const DEFAULT_ROUTE: RouteKey = RouteKey.Dashboard;

export const ROUTES_WITHOUT_PAGE_TITLE: ReadonlySet<RouteKey> = new Set([
  RouteKey.Dashboard,
  RouteKey.Profile,
]);
