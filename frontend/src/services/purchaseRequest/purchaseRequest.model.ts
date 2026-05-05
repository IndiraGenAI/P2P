import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CLOSED';

export interface IPurchaseRequestItemRow {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number | string;
  estimated_rate: number | string;
  amount: number | string;
  remarks?: string | null;
  item?: { id: number; code: string; name: string } | null;
}

export interface IPurchaseRequestDocumentRow {
  id: number;
  purchase_request_id: number;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  uploaded_by: string | null;
  uploaded_date: string | Date | null;
}

export interface IPurchaseRequestApprovalActor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IPurchaseRequestApprovalAssigneeRow {
  id: number;
  user_id: number;
  user: IPurchaseRequestApprovalActor;
}

export interface IPurchaseRequestApprovalStepRow {
  id: number;
  purchase_request_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: string | Date | null;
  remarks: string | null;
  assignees: IPurchaseRequestApprovalAssigneeRow[];
  acted_by_user: IPurchaseRequestApprovalActor | null;
}

/** One step in the list API `approval_progress.steps` trail. */
export interface IPurchaseRequestApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

/** List/grid snapshot from main-service `findAll`. */
export interface IPurchaseRequestApprovalProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps?: IPurchaseRequestApprovalListStep[];
}

export interface IPurchaseRequestRow {
  id: number;
  pr_number: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | Date | null;
  validity_to?: string | Date | null;
  required_date?: string | Date | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_conditions?: string | null;
  center_id?: number | null;
  remarks?: string | null;
  overall_summary?: string | null;
  net_amount?: string | number | null;
  status: PurchaseRequestStatus | string;

  vendor?: { id: number; code?: string | null; name: string } | null;
  vendor_site?: {
    id: number;
    site_code?: string | null;
    site_name?: string | null;
  } | null;
  entity?: { id: number; code?: string | null; name: string } | null;
  department?: { id: number; code?: string | null; name: string } | null;
  subdepartment?: { id: number; code?: string | null; name: string } | null;
  payment_term?: { id: number; code?: string | null; name: string } | null;
  center?: { id: number; code?: string | null; name: string } | null;
  item_type?: { id: number; code?: string | null; name: string } | null;

  items?: IPurchaseRequestItemRow[];
  documents?: IPurchaseRequestDocumentRow[];
  approval_steps?: IPurchaseRequestApprovalStepRow[];
  approval_progress?: IPurchaseRequestApprovalProgress | null;

  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IPurchaseRequestListResult {
  rows: IPurchaseRequestRow[];
  meta: IMetaProps;
}

/** Tab badges only: All + pending queue + approved + rejected. */
export interface IPurchaseRequestStatusCounts {
  ALL: number;
  /** Rows in DB as `SUBMITTED` or `PENDING` (awaiting decision). */
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
}

export interface IPurchaseRequestPayload {
  pr_number?: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | null;
  validity_to?: string | null;
  required_date?: string | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_conditions?: string | null;
  center_id?: number | null;
  remarks?: string | null;
  overall_summary?: string | null;
  net_amount?: number;
  status?: PurchaseRequestStatus | string;
  items: IPurchaseRequestItemPayload[];
}

export interface IPurchaseRequestItemPayload {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number;
  estimated_rate: number;
  amount?: number;
  remarks?: string | null;
}

export interface IPurchaseRequestApprovalDecisionPayload {
  decision: 'APPROVE' | 'REJECT';
  remarks?: string | null;
}
