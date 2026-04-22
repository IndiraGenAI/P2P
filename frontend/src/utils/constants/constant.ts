/**
 * Action codes used by the permission/ability system. Mirrors the backend enum.
 */
export const ActionType = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  FULL_VIEW: 'FULL_VIEW',
  EXPORT_DATA: 'EXPORT_DATA',
  HOLD_BATCH: 'HOLD_BATCH',
  ASSIGN_PERMISSION: 'ASSIGN_PERMISSION',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

/**
 * Mirrors the WEB project's `Common.Modules` map. Each leaf is a `page_code`
 * that the backend's `pages` table emits for permission checks.
 */
export const Common = {
  Actions: {
    CAN_ADD: 'CREATE',
    CAN_UPDATE: 'UPDATE',
    CAN_DELETE: 'DELETE',
    CAN_VIEW: 'VIEW',
    CAN_ASSIGN_PERMISSION: 'ASSIGN_PERMISSION',
  },
  Modules: {
    DASHBOARD: {
      DASHBOARD: 'DASHBOARD',
    },
    USER_CONFIGURATION: {
      USER_CONFIGURATION: 'USER_CONFIGURATION',
      USERS: 'USERS_USERS',
      ROLES: 'USERS_ROLES',
      CONFIGURATION_LIST: 'CONFIGURATION_LIST',
    },
    MASTER: {
      MASTER: 'MASTER',
      VENDORS: 'MASTER_VENDORS',
      COST_CENTER: 'MASTER_COST_CENTER',
      ITEMS: 'MASTER_ITEMS',
      CATEGORIES: 'MASTER_CATEGORIES',
    },
    WORKFLOW: {
      WORKFLOW: 'WORKFLOW',
      WORKFLOW_V1: 'WORKFLOW_V1',
      WORKFLOW_V2: 'WORKFLOW_V2',
    },
    APPROVALS: {
      APPROVALS: 'APPROVALS',
      ITEM_APPROVAL: 'APPROVAL_ITEM',
      VENDOR_APPROVAL: 'APPROVAL_VENDOR',
      BUDGET_APPROVAL: 'APPROVAL_BUDGET',
    },
    PROCUREMENT: {
      PROCUREMENT: 'PROCUREMENT',
      PURCHASE_REQUEST: 'PROCUREMENT_PURCHASE_REQUEST',
      RATE_CONTRACT: 'PROCUREMENT_RATE_CONTRACT',
      PURCHASE_ORDER: 'PROCUREMENT_PURCHASE_ORDER',
      DIRECT_INVOICE: 'PROCUREMENT_DIRECT_INVOICE',
    },
    FINANCE: {
      FINANCE: 'FINANCE',
      BUDGETS: 'FINANCE_BUDGETS',
    },
  },
} as const;

/**
 * Role types mirror the backend `RoleType` enum in `erp-db`.
 * Extra entries (FACULTY_HEAD etc.) are kept so the legacy filter UI compiles
 * without needing the backend to recognise them.
 */
export const RoleType = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  PURCHASER: 'PURCHASER',
  FINANCE: 'FINANCE',
  FACULTY_HEAD: 'FACULTY_HEAD',
  FACULTY: 'FACULTY',
  OPERATION_MANAGER: 'OPERATION_MANAGER',
  SALES_MANAGER: 'SALES_MANAGER',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];
