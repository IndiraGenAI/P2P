import type { IGrnInvoiceDetail } from '@/services/grnInvoice/grnInvoice.model';
import type { IRateContractRecord } from '@/pages/RateContract/RateContract.model';
import type { IRateContractApprovalStepRow } from '@/services/rateContract/rateContract.model';

/** Map GRN Invoice API detail into the Rate Contract form shape (same Add UI). */
export function grnInvoiceDetailToRcRecordShape(
  row: IGrnInvoiceDetail,
): IRateContractRecord {
  return {
    id: row.id,
    rc_number: row.grn_invoice_number ?? '',
    invoice_no: row.invoice_no?.trim() ?? '',
    invoice_date: row.invoice_date ? String(row.invoice_date).slice(0, 10) : '',
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
    oracle_invoice_group: row.oracle_invoice_group?.trim() ?? null,
    oracle_invoice_source: row.oracle_invoice_source?.trim() ?? 'P2P',
    oracle_invoice_type: row.oracle_invoice_type?.trim() ?? 'Standard',
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
      gst_amount:
        item.gst_amount != null ? Number(item.gst_amount) : undefined,
      tds_id: item.tds_id ?? null,
      tds_amount:
        item.tds_amount != null ? Number(item.tds_amount) : undefined,
      net_line_amount:
        item.net_line_amount != null
          ? Number(item.net_line_amount)
          : undefined,
      remarks: item.remarks ?? '',
    })),
  };
}
