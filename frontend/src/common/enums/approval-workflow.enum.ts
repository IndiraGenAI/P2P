import type { SelectOption } from '../models/select.model';

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
