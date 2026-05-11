import type {
  IRateContractApprovalStepRow,
  IRateContractDetail,
  IRateContractRow,
} from '@/services/rateContract/rateContract.model';

export interface IRateContractRecord {
  id: number;
  rc_number?: string | null;
  /** Vendor / statutory invoice reference (distinct from system rc_number / grn_invoice_number). */
  invoice_no?: string | null;
  invoice_date?: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  shipping_vendor_site_id?: number | null;
  billing_vendor_site_id?: number | null;
  shipping_address?: string | null;
  billing_address?: string | null;
  shipping_vendor_site?: IRateContractRow['shipping_vendor_site'];
  billing_vendor_site?: IRateContractRow['billing_vendor_site'];
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
  /** GRN Invoice — Fusion / Oracle header */
  oracle_invoice_group?: string | null;
  oracle_invoice_source?: string | null;
  oracle_invoice_type?: string | null;
  /** Purchase Order form — emergency / unplanned spend */
  unbudgeted_expense?: boolean | null;
  unbudgeted_justification?: string | null;
  advance_po?: boolean | null;
  advance_percentage?: number | null;
  /** Sum of line base amounts (header snapshot for PO / RC). */
  total_base_amount?: number | null;
  status?: string;
  net_amount?: number;
  approval_steps?: IRateContractApprovalStepRow[];
  items: {
    id?: number;
    item_id: number | null;
    description: string;
    center_id: number | null;
    quantity: number;
    rate: number;
    amount: number;
    gst_id?: number | null;
    gst_amount?: number;
    tds_id?: number | null;
    tds_amount?: number;
    net_line_amount?: number;
    remarks: string;
    coa_id?: number | null;
  }[];
}

export const buildRecordFromRow = (
  row: IRateContractDetail,
): IRateContractRecord => ({
  id: row.id,
  rc_number: row.rc_number ?? '',
  entity_id: row.entity_id ?? null,
  vendor_id: row.vendor_id ?? null,
  vendor_site_id: row.vendor_site_id ?? null,
  shipping_vendor_site_id: row.shipping_vendor_site_id ?? null,
  billing_vendor_site_id: row.billing_vendor_site_id ?? null,
  shipping_address: row.shipping_address ?? null,
  billing_address: row.billing_address ?? null,
  shipping_vendor_site: row.shipping_vendor_site ?? null,
  billing_vendor_site: row.billing_vendor_site ?? null,
  currency_id: row.currency_id ?? null,
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
  terms_condition_id: row.terms_condition_id ?? null,
  overall_summary: row.overall_summary ?? '',
  status: row.status ?? 'DRAFT',
  net_amount: row.net_amount != null ? Number(row.net_amount) : 0,
  approval_steps: row.approval_steps,
  items: (row.items ?? []).map((item) => ({
    id: item.id,
    item_id: item.item_id ?? null,
    description: item.description ?? '',
    center_id: item.center_id,
    quantity: Number(item.quantity ?? 0),
    rate: Number(item.rate ?? 0),
    amount: Number(item.base_amount ?? 0),
    gst_id: (item as { gst_id?: number | null }).gst_id ?? null,
    gst_amount: Number((item as { gst_amount?: unknown }).gst_amount ?? 0),
    tds_id: (item as { tds_id?: number | null }).tds_id ?? null,
    tds_amount: Number((item as { tds_amount?: unknown }).tds_amount ?? 0),
    net_line_amount: Number(
      (item as { net_line_amount?: unknown }).net_line_amount ??
        item.base_amount ??
        0,
    ),
    remarks: item.remarks ?? '',
  })),
});
