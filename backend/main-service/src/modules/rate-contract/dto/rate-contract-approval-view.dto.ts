import { RateContract } from 'erp-db';

export interface RateContractApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface RateContractApprovalListProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps: RateContractApprovalListStep[];
}

export interface RateContractApprovalActorView {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RateContractApprovalAssigneeView {
  id: number;
  user_id: number;
  user: RateContractApprovalActorView;
}

export interface RateContractApprovalStepView {
  id: number;
  rate_contract_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: Date | null;
  remarks: string | null;
  assignees: RateContractApprovalAssigneeView[];
  acted_by_user: RateContractApprovalActorView | null;
}

export interface RateContractApprovalTrailDto {
  id: number;
  status: string;
  approval_steps: RateContractApprovalStepView[];
}

export interface RateContractListResponse {
  rows: Array<
    RateContract & {
      approval_progress: RateContractApprovalListProgress | null;
    }
  >;
  count: number;
}
