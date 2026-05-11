import type { SelectOption } from '../models/select.model';

/** Mirrors `backend/main-service/src/commons/enum.ts` for consistent PR workflow values. */

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum PrStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export enum PurchaseRequestApprovalStepStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum PurchaseRequestApprovalDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

/** Rate contract header status (matches main-service `RcStatus`). */
export enum RcStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export enum RateContractFrequency {
  ONE_TIME = 'ONE_TIME',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY',
}

/**
 * Mirror `backend/db/src/enums/approval-workflow.enums.ts` — keep in sync.
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

/**
 * Approval-workflow V2 scope. One workflow per scope.
 * Mirror `backend/db/src/enums/approval-workflow.enums.ts`.
 */
export enum ApprovalWorkflowV2Scope {
  ITEM = 'ITEM',
  VENDOR = 'VENDOR',
  BUDGET = 'BUDGET',
}

const APPROVAL_WORKFLOW_V2_SCOPE_LABELS: Record<ApprovalWorkflowV2Scope, string> = {
  [ApprovalWorkflowV2Scope.ITEM]: 'Item',
  [ApprovalWorkflowV2Scope.VENDOR]: 'Vendor',
  [ApprovalWorkflowV2Scope.BUDGET]: 'Budget',
};

const APPROVAL_WORKFLOW_V2_SCOPE_ORDER: readonly ApprovalWorkflowV2Scope[] = [
  ApprovalWorkflowV2Scope.ITEM,
  ApprovalWorkflowV2Scope.VENDOR,
  ApprovalWorkflowV2Scope.BUDGET,
] as const;

export const APPROVAL_WORKFLOW_V2_SCOPE_OPTIONS: SelectOption<ApprovalWorkflowV2Scope>[] =
  APPROVAL_WORKFLOW_V2_SCOPE_ORDER.map((value) => ({
    value,
    label: APPROVAL_WORKFLOW_V2_SCOPE_LABELS[value],
  }));

const APPROVAL_WORKFLOW_TRANSACTION_TYPE_LABELS: Record<
  ApprovalWorkflowTransactionType,
  string
> = {
  [ApprovalWorkflowTransactionType.PURCHASE_REQUEST]: 'Purchase Request (PR)',
  [ApprovalWorkflowTransactionType.PURCHASE_ORDER]: 'Purchase Order (PO)',
  [ApprovalWorkflowTransactionType.RATE_CONTRACT]: 'Rate Contract',
  [ApprovalWorkflowTransactionType.GRN]: 'GRN',
  [ApprovalWorkflowTransactionType.GRN_INVOICE]: 'GRN Invoice',
  [ApprovalWorkflowTransactionType.DIRECT_INVOICE]: 'Direct Invoice',
  [ApprovalWorkflowTransactionType.BUDGET]: 'Budget',
};

const TRANSACTION_TYPE_ORDER: readonly ApprovalWorkflowTransactionType[] = [
  ApprovalWorkflowTransactionType.PURCHASE_REQUEST,
  ApprovalWorkflowTransactionType.PURCHASE_ORDER,
  ApprovalWorkflowTransactionType.RATE_CONTRACT,
  ApprovalWorkflowTransactionType.GRN,
  ApprovalWorkflowTransactionType.GRN_INVOICE,
  ApprovalWorkflowTransactionType.DIRECT_INVOICE,
  ApprovalWorkflowTransactionType.BUDGET,
] as const;

export const TRANSACTION_TYPE_OPTIONS: SelectOption<ApprovalWorkflowTransactionType>[] =
  TRANSACTION_TYPE_ORDER.map((value) => ({
    value,
    label: APPROVAL_WORKFLOW_TRANSACTION_TYPE_LABELS[value],
  }));
