/**
 * Approval-workflow API / DB contract.
 * Consumed by back-service DTOs and re-exported from `erp-db`.
 * Frontend: keep in sync with `frontend/src/common/enums/approval-workflow.enum.ts`.
 */
export enum ApprovalWorkflowTransactionType {
  PURCHASE_REQUEST = 'PURCHASE_REQUEST',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  RATE_CONTRACT = 'RATE_CONTRACT',
  GRN = 'GRN',
  GRN_INVOICE = 'GRN_INVOICE',
  DIRECT_INVOICE = 'DIRECT_INVOICE',
  BUDGET = 'BUDGET',
}

export enum ApprovalWorkflowStepRole {
  REVIEWER = 'REVIEWER',
  APPROVER = 'APPROVER',
}
