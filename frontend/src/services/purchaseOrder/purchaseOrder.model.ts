import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { PurchaseRequestApprovalDecision } from '@/commons/enum';

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CLOSED';

export interface IPurchaseOrderItemRow {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number | string;
  estimated_rate: number | string;
  amount: number | string;
  remarks?: string | null;
  center_id?: number | null;
  gst_id?: number | null;
  gst_amount?: number | string | null;
  net_line_amount?: number | string | null;
  coa_id?: number | null;
  item?: { id: number; code: string; name: string } | null;
}

export interface IPurchaseOrderDocumentRow {
  id: number;
  purchase_order_id: number;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  uploaded_by: string | null;
  uploaded_date: string | Date | null;
}

export interface IPurchaseOrderApprovalActor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IPurchaseOrderApprovalAssigneeRow {
  id: number;
  user_id: number;
  user: IPurchaseOrderApprovalActor;
}

export interface IPurchaseOrderApprovalStepRow {
  id: number;
  purchase_order_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: string | Date | null;
  remarks: string | null;
  assignees: IPurchaseOrderApprovalAssigneeRow[];
  acted_by_user: IPurchaseOrderApprovalActor | null;
}

/** One step in the list API `approval_progress.steps` trail. */
export interface IPurchaseOrderApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

/** List/grid snapshot from main-service `findAll`. */
export interface IPurchaseOrderApprovalProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps?: IPurchaseOrderApprovalListStep[];
}

export interface IPurchaseOrderRow {
  id: number;
  po_number: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  shipping_vendor_site_id?: number | null;
  billing_vendor_site_id?: number | null;
  shipping_address?: string | null;
  billing_address?: string | null;
  currency_id?: number | null;
  terms_condition_id?: number | null;
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
  total_base_amount?: string | number | null;
  oracle_invoice_group?: string | null;
  oracle_invoice_source?: string | null;
  oracle_invoice_type?: string | null;
  unbudgeted_expense?: boolean | null;
  unbudgeted_justification?: string | null;
  advance_po?: boolean | null;
  advance_percentage?: number | string | null;
  net_amount?: string | number | null;
  status: PurchaseOrderStatus | string;

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

  items?: IPurchaseOrderItemRow[];
  documents?: IPurchaseOrderDocumentRow[];
  approval_steps?: IPurchaseOrderApprovalStepRow[];
  approval_progress?: IPurchaseOrderApprovalProgress | null;

  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IPurchaseOrderListResult {
  rows: IPurchaseOrderRow[];
  meta: IMetaProps;
}

/** Tab badges only: All + pending queue + approved + rejected. */
export interface IPurchaseOrderStatusCounts {
  ALL: number;
  /** Rows in DB as `SUBMITTED` or `PENDING` (awaiting decision). */
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
}

export interface IPurchaseOrderPayload {
  po_number?: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  shipping_vendor_site_id?: number | null;
  billing_vendor_site_id?: number | null;
  shipping_address?: string | null;
  billing_address?: string | null;
  currency_id?: number | null;
  terms_condition_id?: number | null;
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
  total_base_amount?: number | null;
  oracle_invoice_group?: string | null;
  oracle_invoice_source?: string | null;
  oracle_invoice_type?: string | null;
  unbudgeted_expense?: boolean | null;
  unbudgeted_justification?: string | null;
  advance_po?: boolean | null;
  advance_percentage?: number | null;
  net_amount?: number;
  status?: PurchaseOrderStatus | string;
  items: IPurchaseOrderItemPayload[];
}

export interface IPurchaseOrderItemPayload {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number;
  estimated_rate: number;
  amount?: number;
  remarks?: string | null;
  center_id?: number | null;
  gst_id?: number | null;
  gst_amount?: number | null;
  net_line_amount?: number | null;
  coa_id?: number | null;
}

export interface IPurchaseOrderApprovalDecisionPayload {
  decision: PurchaseRequestApprovalDecision;
  remarks?: string | null;
}
