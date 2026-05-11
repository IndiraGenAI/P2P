import type { IRateContractRecord } from '@/pages/RateContract/RateContract.model';
import type {
  IPurchaseOrderPayload,
  IPurchaseOrderRow,
} from '@/services/purchaseOrder/purchaseOrder.model';

/** Maps GET /purchase-order/:id into the shared Rate Contract form shape (PO uses `rc_number` ← `po_number`). */
export function purchaseOrderRowToRateContractRecord(
  row: IPurchaseOrderRow,
): IRateContractRecord {
  return {
    id: row.id,
    rc_number: row.po_number ?? '',
    entity_id: row.entity_id ?? null,
    vendor_id: row.vendor_id ?? null,
    vendor_site_id: row.vendor_site_id ?? null,
    shipping_vendor_site_id: row.shipping_vendor_site_id ?? null,
    billing_vendor_site_id: row.billing_vendor_site_id ?? null,
    shipping_address: row.shipping_address ?? null,
    billing_address: row.billing_address ?? null,
    currency_id: row.currency_id ?? null,
    item_type_id: row.item_type_id ?? null,
    validity_from: row.validity_from
      ? String(row.validity_from).slice(0, 10)
      : '',
    validity_to: row.validity_to
      ? String(row.validity_to).slice(0, 10)
      : '',
    required_date: row.required_date
      ? String(row.required_date).slice(0, 10)
      : '',
    frequency: row.frequency ?? '',
    department_id: row.department_id ?? null,
    subdepartment_id: row.subdepartment_id ?? null,
    payment_term_id: row.payment_term_id ?? null,
    terms_condition_id: row.terms_condition_id ?? null,
    overall_summary: row.overall_summary ?? '',
    oracle_invoice_group: row.oracle_invoice_group ?? null,
    oracle_invoice_source: row.oracle_invoice_source ?? null,
    oracle_invoice_type: row.oracle_invoice_type ?? null,
    unbudgeted_expense: row.unbudgeted_expense ?? null,
    unbudgeted_justification: row.unbudgeted_justification ?? null,
    advance_po: row.advance_po ?? null,
    advance_percentage:
      row.advance_percentage != null
        ? Number(row.advance_percentage)
        : null,
    total_base_amount:
      row.total_base_amount != null
        ? Number(row.total_base_amount)
        : undefined,
    status: row.status ?? 'DRAFT',
    net_amount: row.net_amount != null ? Number(row.net_amount) : 0,
    approval_steps: row.approval_steps as IRateContractRecord['approval_steps'],
    items: (row.items ?? []).map((item) => ({
      id: item.id,
      item_id: item.item_id ?? null,
      description: item.description ?? '',
      center_id: item.center_id ?? null,
      quantity: Number(item.quantity ?? 0),
      rate: Number(item.estimated_rate ?? 0),
      amount: Number(item.amount ?? 0),
      gst_id: item.gst_id ?? null,
      gst_amount: Number(item.gst_amount ?? 0),
      tds_id: null,
      tds_amount: 0,
      net_line_amount: Number(
        item.net_line_amount ?? item.amount ?? 0,
      ),
      remarks: item.remarks ?? '',
      coa_id: item.coa_id ?? null,
    })),
  };
}

export function rateContractRecordToPurchaseOrderPayload(
  v: IRateContractRecord,
): IPurchaseOrderPayload {
  const items = v.items.map((line) => ({
    item_id: line.item_id ?? 0,
    description: line.description?.trim() || null,
    quantity: Number(line.quantity ?? 0),
    estimated_rate: Number(line.rate ?? 0),
    amount: Number(line.amount ?? 0),
    remarks: line.remarks?.trim() ?? '',
    center_id: line.center_id ?? null,
    gst_id: line.gst_id ?? null,
    gst_amount: Number(line.gst_amount ?? 0),
    net_line_amount: Number(line.net_line_amount ?? line.amount ?? 0),
    coa_id: line.coa_id ?? null,
  }));

  const totalBase = v.items.reduce((s, r) => s + Number(r.amount ?? 0), 0);

  return {
    po_number: v.rc_number?.trim() || undefined,
    entity_id: v.entity_id ?? null,
    vendor_id: v.vendor_id ?? null,
    vendor_site_id: v.vendor_site_id ?? null,
    shipping_vendor_site_id: v.shipping_vendor_site_id ?? null,
    billing_vendor_site_id: v.billing_vendor_site_id ?? null,
    shipping_address: v.shipping_address ?? null,
    billing_address: v.billing_address ?? null,
    currency_id: v.currency_id ?? null,
    item_type_id: v.item_type_id ?? null,
    validity_from: v.validity_from || null,
    validity_to: v.validity_to || null,
    required_date: v.required_date || null,
    frequency: v.frequency || null,
    department_id: v.department_id ?? null,
    subdepartment_id: v.subdepartment_id ?? null,
    payment_term_id: v.payment_term_id ?? null,
    terms_condition_id: v.terms_condition_id ?? null,
    overall_summary: v.overall_summary?.trim() || null,
    net_amount: v.net_amount,
    total_base_amount: totalBase,
    oracle_invoice_group: v.oracle_invoice_group ?? null,
    oracle_invoice_source: v.oracle_invoice_source ?? null,
    oracle_invoice_type: v.oracle_invoice_type ?? null,
    unbudgeted_expense: v.unbudgeted_expense ?? undefined,
    unbudgeted_justification: v.unbudgeted_justification ?? null,
    advance_po: v.advance_po ?? undefined,
    advance_percentage:
      v.advance_percentage != null ? Number(v.advance_percentage) : null,
    status: 'SUBMITTED',
    items,
  };
}
