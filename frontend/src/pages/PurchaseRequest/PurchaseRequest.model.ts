import type {
  IPurchaseRequestApprovalStepRow,
  IPurchaseRequestItemPayload,
  IPurchaseRequestRow,
  PurchaseRequestStatus,
} from '@/services/purchaseRequest/purchaseRequest.service';

export interface IPurchaseRequestRecord {
  id: number;
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
  status?: PurchaseRequestStatus | string;
  net_amount?: number;
  items: IPurchaseRequestItemPayload[];
  approval_steps?: IPurchaseRequestApprovalStepRow[];
}

export const buildRecordFromRow = (
  row: IPurchaseRequestRow,
): IPurchaseRequestRecord => ({
  id: row.id,
  pr_number: row.pr_number ?? '',
  entity_id: row.entity_id ?? null,
  vendor_id: row.vendor_id ?? null,
  vendor_site_id: row.vendor_site_id ?? null,
  item_type_id: row.item_type_id ?? null,
  validity_from: row.validity_from
    ? String(row.validity_from).slice(0, 10)
    : '',
  validity_to: row.validity_to ? String(row.validity_to).slice(0, 10) : '',
  required_date: row.required_date
    ? String(row.required_date).slice(0, 10)
    : '',
  frequency: row.frequency ?? '',
  department_id: row.department_id ?? null,
  subdepartment_id: row.subdepartment_id ?? null,
  payment_term_id: row.payment_term_id ?? null,
  terms_conditions: row.terms_conditions ?? '',
  center_id: row.center_id ?? null,
  remarks: row.remarks ?? '',
  overall_summary: row.overall_summary ?? '',
  status: row.status ?? 'DRAFT',
  net_amount: row.net_amount ? Number(row.net_amount) : 0,
  approval_steps: row.approval_steps ?? [],
  items: (row.items ?? []).map((item) => ({
    id: item.id,
    item_id: item.item_id ?? null,
    description: item.description ?? '',
    quantity: Number(item.quantity ?? 0),
    estimated_rate: Number(item.estimated_rate ?? 0),
    amount: Number(item.amount ?? 0),
    remarks: item.remarks ?? '',
  })),
});
