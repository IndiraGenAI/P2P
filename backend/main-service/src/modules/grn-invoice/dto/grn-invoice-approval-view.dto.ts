import { GrnInvoice } from 'erp-db';

export interface GrnInvoiceApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface GrnInvoiceApprovalListProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps: GrnInvoiceApprovalListStep[];
}

export interface GrnInvoiceApprovalActorView {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface GrnInvoiceApprovalAssigneeView {
  id: number;
  user_id: number;
  user: GrnInvoiceApprovalActorView;
}

export interface GrnInvoiceApprovalStepView {
  id: number;
  grn_invoice_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: Date | null;
  remarks: string | null;
  assignees: GrnInvoiceApprovalAssigneeView[];
  acted_by_user: GrnInvoiceApprovalActorView | null;
}

export interface GrnInvoiceApprovalTrailDto {
  id: number;
  status: string;
  approval_steps: GrnInvoiceApprovalStepView[];
}

export interface GrnListResponse {
  rows: Array<
    GrnInvoice & {
      approval_progress: GrnInvoiceApprovalListProgress | null;
    }
  >;
  count: number;
}
