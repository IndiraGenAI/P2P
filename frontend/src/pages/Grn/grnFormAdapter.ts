import type { IGrnDetail } from '@/services/grn/grn.model';
import type { IRateContractRecord } from '@/pages/RateContract/RateContract.model';
import type { IRateContractApprovalStepRow } from '@/services/rateContract/rateContract.model';

function formatYmd(value: string | Date | null | undefined): string {
  if (value == null || value === '') return '';
  const s = typeof value === 'string' ? value : String(value);
  return s.slice(0, 10);
}

/** Reuse Rate Contract form UI: map GRN API detail into the RC record shape. */
export function grnDetailToRcRecordShape(row: IGrnDetail): IRateContractRecord {
  return {
    id: row.id,
    rc_number: row.grn_number ?? '',
    invoice_no: row.invoice_no?.trim() ?? '',
    invoice_date: formatYmd(row.invoice_date),
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
    approval_steps: row.approval_steps as unknown as
      | IRateContractApprovalStepRow[]
      | undefined,
    items: (row.items ?? []).map((item) => ({
      id: item.id,
      item_id: item.item_id ?? null,
      description: item.description ?? '',
      center_id: item.center_id,
      quantity: Number(item.quantity ?? 0),
      rate: Number(item.rate ?? 0),
      amount: Number(item.base_amount ?? 0),
      gst_id: item.gst_id ?? null,
      gst_amount: Number(item.gst_amount ?? 0),
      net_line_amount: Number(
        item.net_line_amount ?? item.base_amount ?? 0,
      ),
      remarks: item.remarks ?? '',
    })),
  };
}
