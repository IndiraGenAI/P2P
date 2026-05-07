import { Grn } from 'erp-db';

export interface GrnApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface GrnApprovalListProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps: GrnApprovalListStep[];
}

export interface GrnApprovalActorView {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface GrnApprovalAssigneeView {
  id: number;
  user_id: number;
  user: GrnApprovalActorView;
}

export interface GrnApprovalStepView {
  id: number;
  grn_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: Date | null;
  remarks: string | null;
  assignees: GrnApprovalAssigneeView[];
  acted_by_user: GrnApprovalActorView | null;
}

export interface GrnApprovalTrailDto {
  id: number;
  status: string;
  approval_steps: GrnApprovalStepView[];
}

export interface GrnListResponse {
  rows: Array<
    Grn & {
      approval_progress: GrnApprovalListProgress | null;
    }
  >;
  count: number;
}
