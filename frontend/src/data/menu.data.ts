import {
  BadgeCheck,
  Database,
  FileSignature,
  FileText,
  GitBranch,
  LayoutGrid,
  Network,
  PackageCheck,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { Common } from '@/utils/constants/constant';
import type { MenuItem } from '@/common/models';

const { Actions, Modules } = Common;

/**
 * Nested menu tree consumed by the sidebar. Mirrors the WEB project's
 * SubMenu structure but rendered with the modern Tailwind UI.
 *
 * - A leaf shows up only when `ability.can(action, pageCode)` is true AND
 *   `pageCode` is in the SidebarPermissionCode `isCode` list.
 * - A group shows up when at least one child would be visible.
 */
export const APP_MENU_ITEMS: MenuItem[] = [
  {
    // Dashboard is always shown — it matches the always-on `/dashboard` route
    // in App.tsx, so users see something useful even before any role
    // permissions have been assigned. Omitting `pageCode`/`action` makes
    // `canShowMenuItem` short-circuit to true.
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    to: '/dashboard',
  },
  {
    key: 'user-config',
    label: 'User Configuration',
    icon: Users,
    children: [
      {
        key: 'users',
        label: 'User Management',
        icon: Users,
        to: '/user-management',
        pageCode: Modules.USER_CONFIGURATION.USERS,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'roles',
        label: 'Role Config',
        icon: ShieldCheck,
        to: '/roles',
        pageCode: Modules.USER_CONFIGURATION.ROLES,
        action: Actions.CAN_VIEW,
      },
    ],
  },
  {
    key: 'workflow',
    label: 'Workflows',
    icon: GitBranch,
    children: [
      {
        key: 'workflows',
        label: 'Workflows',
        icon: GitBranch,
        to: '/workflows',
        pageCode: Modules.WORKFLOW.WORKFLOW_V1,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'workflows-v2',
        label: 'Workflow (V2)',
        icon: Network,
        to: '/workflows-v2',
        pageCode: Modules.WORKFLOW.WORKFLOW_V2,
        action: Actions.CAN_VIEW,
      },
    ],
  },
  {
    key: 'approvals',
    label: 'Approvals',
    icon: BadgeCheck,
    children: [
      {
        key: 'item-approval',
        label: 'Item Approval',
        icon: PackageCheck,
        to: '/item-approval',
        pageCode: Modules.APPROVALS.ITEM_APPROVAL,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'vendor-approval',
        label: 'Vendor Approval',
        icon: UserCheck,
        to: '/vendor-approval',
        pageCode: Modules.APPROVALS.VENDOR_APPROVAL,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'budget-approval',
        label: 'Budget Approval',
        icon: BadgeCheck,
        to: '/budget-approval',
        pageCode: Modules.APPROVALS.BUDGET_APPROVAL,
        action: Actions.CAN_VIEW,
      },
    ],
  },
  {
    key: 'masters',
    label: 'Masters Control',
    icon: Database,
    to: '/masters-control',
    pageCode: Modules.MASTER.MASTER,
    action: Actions.CAN_VIEW,
  },
  {
    key: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    children: [
      {
        key: 'purchase-request',
        label: 'Purchase Request',
        icon: FileText,
        to: '/purchase-request',
        pageCode: Modules.PROCUREMENT.PURCHASE_REQUEST,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'rate-contract',
        label: 'Rate Contract',
        icon: FileSignature,
        to: '/rate-contract',
        pageCode: Modules.PROCUREMENT.RATE_CONTRACT,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'purchase-order',
        label: 'Purchase Order',
        icon: ShoppingCart,
        to: '/purchase-order',
        pageCode: Modules.PROCUREMENT.PURCHASE_ORDER,
        action: Actions.CAN_VIEW,
      },
      {
        key: 'direct-invoice',
        label: 'Direct Invoice',
        icon: Receipt,
        to: '/direct-invoice',
        pageCode: Modules.PROCUREMENT.DIRECT_INVOICE,
        action: Actions.CAN_VIEW,
      },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: Wallet,
    children: [
      {
        key: 'budgets',
        label: 'Budgets',
        icon: Wallet,
        to: '/budgets',
        pageCode: Modules.FINANCE.BUDGETS,
        action: Actions.CAN_VIEW,
      },
    ],
  },
];

/**
 * Flatten the tree so the route table and the page-title lookup can pick up
 * every leaf (and its `pageCode`) in one pass.
 */
export const APP_MENU_LEAVES: MenuItem[] = APP_MENU_ITEMS.flatMap((item) =>
  item.children?.length ? item.children : [item],
).filter((item) => !!item.to);
