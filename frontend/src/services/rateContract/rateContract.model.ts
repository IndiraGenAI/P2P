import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { PurchaseRequestApprovalDecision } from '@/commons/enum';

export type RateContractStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CLOSED';

export interface IRateContractItemPayload {
  item_id: number;
  description?: string | null;
  center_id: number;
  quantity?: number;
  rate: number;
  base_amount?: number;
  remarks: string;
}

export interface IRateContractPayload {
  rc_number?: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  shipping_vendor_site_id?: number | null;
  billing_vendor_site_id?: number | null;
  shipping_address?: string | null;
  billing_address?: string | null;
  currency_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | null;
  validity_to?: string | null;
  required_date?: string | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_condition_id?: number | null;
  overall_summary?: string | null;
  net_amount?: number;
  status?: string;
  items: IRateContractItemPayload[];
}

export interface IRateContractItemRow {
  id: number;
  rate_contract_id: number;
  item_id?: number | null;
  description?: string | null;
  center_id: number;
  quantity: number | string;
  rate: number | string;
  base_amount: number | string;
  remarks?: string | null;
  item?: { id: number; code: string; name: string } | null;
  center?: { id: number; code: string; name: string };
}

export interface IRateContractApprovalActor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IRateContractApprovalAssigneeRow {
  id: number;
  user_id: number;
  user: IRateContractApprovalActor;
}

export interface IRateContractApprovalStepRow {
  id: number;
  rate_contract_id: number;
  sequence_order: number;
  approval_workflow_step_id: number | null;
  step_role: string;
  status: string;
  acted_by_user_id: number | null;
  acted_at: string | Date | null;
  remarks: string | null;
  assignees: IRateContractApprovalAssigneeRow[];
  acted_by_user: IRateContractApprovalActor | null;
}

export interface IRateContractApprovalListStep {
  sequence_order: number;
  step_role: string;
  status: string;
}

export interface IRateContractApprovalProgress {
  total_steps: number;
  current_step: number | null;
  current_role: string | null;
  rejected_at_step: number | null;
  steps?: IRateContractApprovalListStep[];
}

export interface IRateContractDocumentRow {
  id: number;
  rate_contract_id: number;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  uploaded_by: string | null;
  uploaded_date: string | Date | null;
}

export interface IRateContractRow {
  id: number;
  rc_number: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  shipping_vendor_site_id?: number | null;
  billing_vendor_site_id?: number | null;
  shipping_address?: string | null;
  billing_address?: string | null;
  currency_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | Date | null;
  validity_to?: string | Date | null;
  required_date?: string | Date | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_condition_id?: number | null;
  overall_summary?: string | null;
  total_base_amount?: number | string | null;
  net_amount?: number | string | null;
  status?: string | null;
  vendor?: { id: number; code?: string | null; name: string } | null;
  entity?: { id: number; code?: string | null; name: string } | null;
  vendor_site?: { id: number; site_code: string; site_name?: string | null } | null;
  shipping_vendor_site?: {
    id: number;
    site_code: string;
    site_name?: string | null;
    address?: string | null;
  } | null;
  billing_vendor_site?: {
    id: number;
    site_code: string;
    site_name?: string | null;
    address?: string | null;
  } | null;
  currency?: { id: number; code: string; name: string } | null;
  item_type?: { id: number; code?: string | null; name: string } | null;
  department?: { id: number; code?: string | null; name: string } | null;
  subdepartment?: { id: number; code?: string | null; name: string } | null;
  payment_term?: { id: number; code?: string | null; name: string } | null;
  terms_condition?: { id: number; code: string; name: string } | null;
  /** Populated by list API when approval chain exists. */
  approval_progress?: IRateContractApprovalProgress | null;
  created_date?: string | Date | null;
  updated_date?: string | Date | null;
}

export interface IRateContractListResult {
  rows: IRateContractRow[];
  meta: IMetaProps;
}

export interface IRateContractStatusCounts {
  ALL: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
}

export interface IRateContractDetail extends IRateContractRow {
  items: IRateContractItemRow[];
  documents: IRateContractDocumentRow[];
  approval_steps?: IRateContractApprovalStepRow[];
}

export interface IRateContractApprovalDecisionPayload {
  decision: PurchaseRequestApprovalDecision;
  remarks?: string | null;
}
