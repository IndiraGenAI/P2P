import { PurchaseOrder } from 'erp-db';

export interface PurchaseOrderApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface PurchaseOrderApprovalListProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps: PurchaseOrderApprovalListStep[];
}

export interface PurchaseOrderListResponse {
  rows: Array<
    PurchaseOrder & { approval_progress: PurchaseOrderApprovalListProgress | null }
  >;
  count: number;
}

export interface PurchaseOrderApprovalActorView {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PurchaseOrderApprovalAssigneeView {
  id: number;
  user_id: number;
  user: PurchaseOrderApprovalActorView;
}

export interface PurchaseOrderApprovalStepView {
  id: number;
  purchase_order_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: Date | null;
  remarks: string | null;
  assignees: PurchaseOrderApprovalAssigneeView[];
  acted_by_user: PurchaseOrderApprovalActorView | null;
}

export interface PurchaseOrderApprovalTrailDto {
  id: number;
  status: string;
  approval_steps: PurchaseOrderApprovalStepView[];
}
