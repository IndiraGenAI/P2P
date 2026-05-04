import type {
  ApprovalWorkflowStepRole,
  ApprovalWorkflowTransactionType,
} from '@/common/enums/approval-workflow.enum';

export interface IApprovalWorkflowStep {
  order: number;
  role: ApprovalWorkflowStepRole;
  user_ids: number[];
}

export interface IApprovalWorkflowLimit {
  order: number;
  min: number;
  max: number | null;
  steps: IApprovalWorkflowStep[];
}

export interface IApprovalWorkflowScope {
  entity_id: number;
  transaction_type: ApprovalWorkflowTransactionType;
  subdepartment_id: number;
  center_id: number | null;
}

/** Response from GET / POST approval-workflow */
export interface IApprovalWorkflowDetails {
  id: number;
  scope: IApprovalWorkflowScope;
  limits: IApprovalWorkflowLimit[];
}

export interface ISaveApprovalWorkflowPayload {
  entity_id: number;
  transaction_type: ApprovalWorkflowTransactionType;
  subdepartment_id: number;
  center_id?: number | null;
  limits: IApprovalWorkflowLimit[];
}
