import type {
  ApprovalWorkflowStepRole,
  ApprovalWorkflowV2Scope,
} from '@/common/enums';

export interface IApprovalWorkflowV2Step {
  order: number;
  role: ApprovalWorkflowStepRole;
  user_ids: number[];
}

/** Response from GET / POST /approval-workflow-v2 */
export interface IApprovalWorkflowV2Details {
  id: number;
  scope: ApprovalWorkflowV2Scope;
  steps: IApprovalWorkflowV2Step[];
}

export interface ISaveApprovalWorkflowV2Payload {
  scope: ApprovalWorkflowV2Scope;
  steps: IApprovalWorkflowV2Step[];
}
