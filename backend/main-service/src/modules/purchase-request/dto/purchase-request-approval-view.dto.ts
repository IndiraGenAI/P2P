import { PurchaseRequest } from 'erp-db';

export interface PurchaseRequestApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface PurchaseRequestApprovalListProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps: PurchaseRequestApprovalListStep[];
}

export interface PurchaseRequestListResponse {
  rows: Array<
    PurchaseRequest & { approval_progress: PurchaseRequestApprovalListProgress | null }
  >;
  count: number;
}

export interface PurchaseRequestApprovalActorView {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PurchaseRequestApprovalAssigneeView {
  id: number;
  user_id: number;
  user: PurchaseRequestApprovalActorView;
}

export interface PurchaseRequestApprovalStepView {
  id: number;
  purchase_request_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: Date | null;
  remarks: string | null;
  assignees: PurchaseRequestApprovalAssigneeView[];
  acted_by_user: PurchaseRequestApprovalActorView | null;
}

export interface PurchaseRequestApprovalTrailDto {
  id: number;
  status: string;
  approval_steps: PurchaseRequestApprovalStepView[];
}
