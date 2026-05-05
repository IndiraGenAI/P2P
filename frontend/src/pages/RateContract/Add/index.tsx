import { useEffect, useMemo, useState } from 'react';
import { DatePicker, Form, Input, InputNumber } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Plus, Trash2 } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import vendorSiteService, {
  type IVendorSiteRow,
} from '@/services/vendorSite/vendorSite.service';
import entityService from '@/services/entity/entity.service';
import type { SelectOption } from '@/common/models';
import { RateContractFrequency } from '@/commons/enum';
import type { IRateContractRecord } from '../RateContract.model';
import type { IRateContractAddProps } from './Add.model';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD MMM YYYY';
const toDayjs = (value: string) => {
  if (!value) return null;
  const d = dayjs(value, ['YYYY-MM-DD', DATE_FORMAT], true);
  return d.isValid() ? d : null;
};
const fromDayjs = (value: Dayjs | null) =>
  value?.isValid() ? value.format('YYYY-MM-DD') : '';

const SECTION_TITLE =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-600 uppercase mb-4';
const SECTION_DIVIDER = 'border-t border-gray-200 pt-6 mt-2';
const FIELD_INPUT_CLASS = 'rounded-xl soft-input !py-2.5';

const wrapLabel = (label: string) => (
  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
    {label}
  </span>
);

const FREQUENCY_OPTIONS = [
  { value: '', label: 'Frequency…' },
  { value: RateContractFrequency.ONE_TIME, label: 'One Time' },
  { value: RateContractFrequency.WEEKLY, label: 'Weekly' },
  { value: RateContractFrequency.MONTHLY, label: 'Monthly' },
  { value: RateContractFrequency.QUARTERLY, label: 'Quarterly' },
  { value: RateContractFrequency.HALF_YEARLY, label: 'Half Yearly' },
  { value: RateContractFrequency.YEARLY, label: 'Yearly' },
];

/** Legacy RC rows stored ship/bill as vendor_site FKs; encoded in the form for edit-only display. */
const LEGACY_VS_PREFIX = 'rc-vs:';

function decodeShipBillSelection(sel: string): {
  address: string | null;
  vendor_site_id: number | null;
} {
  const t = sel?.trim();
  if (!t) return { address: null, vendor_site_id: null };
  if (t.startsWith(LEGACY_VS_PREFIX)) {
    const id = Number(t.slice(LEGACY_VS_PREFIX.length));
    return Number.isFinite(id) && id > 0
      ? { address: null, vendor_site_id: id }
      : { address: null, vendor_site_id: null };
  }
  return { address: t, vendor_site_id: null };
}

function legacyVendorSiteLabel(s: {
  site_code: string;
  site_name?: string | null;
  address?: string | null;
}): string {
  const tail = (s.site_name ?? s.address ?? '').trim();
  return tail ? `${s.site_code} — ${tail}` : s.site_code;
}

interface ItemRowDraft {
  id?: number;
  item_id: number | null;
  description: string;
  center_id: number | null;
  quantity: number;
  rate: number;
  amount: number;
  remarks: string;
}

const emptyRow = (): ItemRowDraft => ({
  item_id: null,
  description: '',
  center_id: null,
  quantity: 1,
  rate: 0,
  amount: 0,
  remarks: '',
});

interface FormValues {
  rc_number: string;
  entity_id: string;
  vendor_id: string;
  vendor_site_id: string;
  shipping_selection: string;
  billing_selection: string;
  currency_id: string;
  item_type_id: string;
  validity_from: string;
  validity_to: string;
  required_date: string;
  frequency: string;
  department_id: string;
  subdepartment_id: string;
  payment_term_id: string;
  terms_condition_id: string;
  overall_summary: string;
}

const RateContractAdd = (props: IRateContractAddProps) => {
  const {
    data,
    readOnly = false,
    onSubmit,
    myRef,
    vendors,
    entities,
    itemTypes,
    departments,
    subdepartments,
    paymentTerms,
    centers,
    items,
    termsConditions,
    currencies,
  } = props;
  const [form] = Form.useForm<FormValues>();
  const isEdit = !!data?.id;
  const ro = readOnly;

  const initialValues = useMemo<FormValues>(
    () => ({
      rc_number: data?.rc_number ?? '',
      entity_id: data?.entity_id ? String(data.entity_id) : '',
      vendor_id: data?.vendor_id ? String(data.vendor_id) : '',
      vendor_site_id: data?.vendor_site_id
        ? String(data.vendor_site_id)
        : '',
      shipping_selection: (() => {
        const a = data?.shipping_address?.trim();
        if (a) return a;
        if (data?.shipping_vendor_site_id)
          return `${LEGACY_VS_PREFIX}${data.shipping_vendor_site_id}`;
        return '';
      })(),
      billing_selection: (() => {
        const a = data?.billing_address?.trim();
        if (a) return a;
        if (data?.billing_vendor_site_id)
          return `${LEGACY_VS_PREFIX}${data.billing_vendor_site_id}`;
        return '';
      })(),
      currency_id: data?.currency_id ? String(data.currency_id) : '',
      item_type_id: data?.item_type_id ? String(data.item_type_id) : '',
      validity_from: data?.validity_from ?? '',
      validity_to: data?.validity_to ?? '',
      required_date: data?.required_date ?? '',
      frequency: data?.frequency ?? '',
      department_id: data?.department_id ? String(data.department_id) : '',
      subdepartment_id: data?.subdepartment_id
        ? String(data.subdepartment_id)
        : '',
      payment_term_id: data?.payment_term_id
        ? String(data.payment_term_id)
        : '',
      terms_condition_id: data?.terms_condition_id
        ? String(data.terms_condition_id)
        : '',
      overall_summary: data?.overall_summary ?? '',
    }),
    [data],
  );

  const [local, setLocal] = useState<FormValues>(initialValues);
  const [vendorSites, setVendorSites] = useState<SelectOption[]>([]);
  const [vendorSitesLoading, setVendorSitesLoading] = useState(false);
  const [entityShipOptions, setEntityShipOptions] = useState<SelectOption[]>(
    [],
  );
  const [entityBillOptions, setEntityBillOptions] = useState<SelectOption[]>(
    [],
  );
  const [entityAddrLoading, setEntityAddrLoading] = useState(false);
  const [rows, setRows] = useState<ItemRowDraft[]>(() =>
    data?.items?.length
      ? data.items.map((item) => ({
          id: item.id,
          item_id: item.item_id ?? null,
          description: item.description ?? '',
          center_id: item.center_id ?? null,
          quantity: Number(item.quantity ?? 1),
          rate: Number(item.rate ?? 0),
          amount: Number(item.amount ?? 0),
          remarks: item.remarks ?? '',
        }))
      : [emptyRow()],
  );
  const [itemsError, setItemsError] = useState<string>('');

  useEffect(() => {
    form.resetFields();
    setLocal(initialValues);
    setRows(
      data?.items?.length
        ? data.items.map((item) => ({
            id: item.id,
            item_id: item.item_id ?? null,
            description: item.description ?? '',
            center_id: item.center_id ?? null,
            quantity: Number(item.quantity ?? 1),
            rate: Number(item.rate ?? 0),
            amount: Number(item.amount ?? 0),
            remarks: item.remarks ?? '',
          }))
        : [emptyRow()],
    );
    setItemsError('');
  }, [initialValues]);

  const setField = (key: keyof FormValues, value: string) => {
    setLocal((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'department_id') {
        next.subdepartment_id = '';
      }
      if (key === 'vendor_id' && value !== prev.vendor_id) {
        next.vendor_site_id = '';
      }
      if (key === 'entity_id' && value !== prev.entity_id) {
        next.shipping_selection = '';
        next.billing_selection = '';
      }
      return next;
    });
    if (key === 'department_id') {
      form.setFieldsValue({
        department_id: value,
        subdepartment_id: '',
      } as Partial<FormValues>);
    } else if (key === 'vendor_id') {
      form.setFieldsValue({
        vendor_id: value,
        vendor_site_id: '',
      } as Partial<FormValues>);
    } else if (key === 'entity_id') {
      form.setFieldsValue({
        entity_id: value,
        shipping_selection: '',
        billing_selection: '',
      } as Partial<FormValues>);
    } else {
      form.setFieldsValue({ [key]: value } as Partial<FormValues>);
    }
  };

  useEffect(() => {
    const vendorId = local.vendor_id;
    if (!vendorId) {
      setVendorSites([]);
      return;
    }
    let cancelled = false;
    setVendorSitesLoading(true);
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');
    params.set('vendor_id', vendorId);
    vendorSiteService
      .search(params)
      .then((res) => {
        if (cancelled) return;
        const list = (res.data as { rows: IVendorSiteRow[] }).rows ?? [];
        setVendorSites(
          list.map((s) => ({
            value: String(s.id),
            label: s.site_name
              ? `${s.site_code} — ${s.site_name}`
              : s.site_code,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setVendorSites([]);
      })
      .finally(() => {
        if (!cancelled) setVendorSitesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [local.vendor_id]);

  useEffect(() => {
    const eid = local.entity_id;
    if (!eid) {
      setEntityShipOptions([]);
      setEntityBillOptions([]);
      return;
    }
    let cancelled = false;
    setEntityAddrLoading(true);
    entityService
      .getEntityById(Number(eid))
      .then((res) => {
        if (cancelled) return;
        const row = res.data;
        const ship = (row.shipping_addresses ?? []).filter(
          (a) => typeof a === 'string' && a.trim().length > 0,
        );
        const bill = (row.billing_addresses ?? []).filter(
          (a) => typeof a === 'string' && a.trim().length > 0,
        );
        setEntityShipOptions(
          ship.map((addr) => ({ value: addr.trim(), label: addr.trim() })),
        );
        setEntityBillOptions(
          bill.map((addr) => ({ value: addr.trim(), label: addr.trim() })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setEntityShipOptions([]);
          setEntityBillOptions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setEntityAddrLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [local.entity_id]);

  const shippingSelectOptions = useMemo(() => {
    const base = [...entityShipOptions];
    const sel = local.shipping_selection;
    if (
      sel.startsWith(LEGACY_VS_PREFIX) &&
      data?.shipping_vendor_site &&
      Number(sel.slice(LEGACY_VS_PREFIX.length)) === data.shipping_vendor_site.id
    ) {
      const enc = `${LEGACY_VS_PREFIX}${data.shipping_vendor_site.id}`;
      if (!base.some((o) => o.value === enc)) {
        base.unshift({
          value: enc,
          label: legacyVendorSiteLabel(data.shipping_vendor_site),
        });
      }
    }
    return base;
  }, [entityShipOptions, local.shipping_selection, data?.shipping_vendor_site]);

  const billingSelectOptions = useMemo(() => {
    const base = [...entityBillOptions];
    const sel = local.billing_selection;
    if (
      sel.startsWith(LEGACY_VS_PREFIX) &&
      data?.billing_vendor_site &&
      Number(sel.slice(LEGACY_VS_PREFIX.length)) === data.billing_vendor_site.id
    ) {
      const enc = `${LEGACY_VS_PREFIX}${data.billing_vendor_site.id}`;
      if (!base.some((o) => o.value === enc)) {
        base.unshift({
          value: enc,
          label: legacyVendorSiteLabel(data.billing_vendor_site),
        });
      }
    }
    return base;
  }, [entityBillOptions, local.billing_selection, data?.billing_vendor_site]);

  const filteredSubdepartments = useMemo(
    () =>
      local.department_id
        ? subdepartments.filter(
            (sd) => sd.department_id === local.department_id,
          )
        : [],
    [subdepartments, local.department_id],
  );

  const updateRow = (index: number, patch: Partial<ItemRowDraft>) => {
    setRows((prev) => {
      const next = [...prev];
      const merged = { ...next[index], ...patch };
      const hasQty = patch.quantity !== undefined;
      const hasRate = patch.rate !== undefined;
      if (hasQty || hasRate) {
        merged.amount =
          Number(merged.quantity ?? 0) * Number(merged.rate ?? 0);
      }
      next[index] = merged;
      return next;
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index: number) =>
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );

  const totalNet = useMemo(
    () => rows.reduce((sum, r) => sum + Number(r.amount ?? 0), 0),
    [rows],
  );

  const onFinish = (values: FormValues) => {
    if (ro) return;
    if (!rows.length) {
      setItemsError('Please add at least one item.');
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 1;
      if (r.item_id == null || r.item_id < 1) {
        setItemsError(`Row ${rowNum}: select an item.`);
        return;
      }
      if (r.center_id == null || r.center_id < 1) {
        setItemsError(`Row ${rowNum}: select a center.`);
        return;
      }
      const qty = Number(r.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        setItemsError(`Row ${rowNum}: quantity must be greater than 0.`);
        return;
      }
      const rate = Number(r.rate);
      if (!Number.isFinite(rate) || rate < 0) {
        setItemsError(`Row ${rowNum}: rate must be zero or greater.`);
        return;
      }
      if (!String(r.remarks ?? '').trim()) {
        setItemsError(`Row ${rowNum}: remarks are required.`);
        return;
      }
    }
    setItemsError('');

    const shipDec = decodeShipBillSelection(values.shipping_selection);
    const billDec = decodeShipBillSelection(values.billing_selection);

    const payload: IRateContractRecord = {
      id: data?.id ?? 0,
      rc_number: values.rc_number?.trim() || undefined,
      entity_id: values.entity_id ? Number(values.entity_id) : null,
      vendor_id: values.vendor_id ? Number(values.vendor_id) : null,
      vendor_site_id: values.vendor_site_id
        ? Number(values.vendor_site_id)
        : null,
      shipping_address: shipDec.address,
      billing_address: billDec.address,
      shipping_vendor_site_id: shipDec.vendor_site_id,
      billing_vendor_site_id: billDec.vendor_site_id,
      currency_id: values.currency_id ? Number(values.currency_id) : null,
      item_type_id: values.item_type_id ? Number(values.item_type_id) : null,
      validity_from: local.validity_from || null,
      validity_to: local.validity_to || null,
      required_date: local.required_date || null,
      frequency: local.frequency || null,
      department_id: values.department_id ? Number(values.department_id) : null,
      subdepartment_id: values.subdepartment_id
        ? Number(values.subdepartment_id)
        : null,
      payment_term_id: values.payment_term_id
        ? Number(values.payment_term_id)
        : null,
      terms_condition_id: values.terms_condition_id
        ? Number(values.terms_condition_id)
        : null,
      overall_summary: values.overall_summary?.trim() || null,
      status: data?.id ? (data?.status ?? 'DRAFT') : 'SUBMITTED',
      net_amount: totalNet,
      items: rows.map((r) => ({
        id: r.id,
        item_id: r.item_id ?? null,
        description: r.description?.trim() || '',
        center_id: r.center_id ?? null,
        quantity: Number(r.quantity ?? 0),
        rate: Number(r.rate ?? 0),
        amount: Number(r.amount ?? 0),
        remarks: r.remarks?.trim() ?? '',
      })),
    };
    onSubmit(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <div>
        <p className={SECTION_TITLE}>Contract header</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item
            name="rc_number"
            label={wrapLabel('RC number (auto-generated)')}
          >
            <Input
              placeholder="Auto-generated"
              className={FIELD_INPUT_CLASS}
              size="large"
              disabled={ro || !isEdit}
            />
          </Form.Item>
          <div />
          <Form.Item
            name="entity_id"
            label={wrapLabel('Entity')}
            rules={[{ required: true, message: 'Please select entity' }]}
          >
            <Select
              value={local.entity_id}
              onChange={(v) => setField('entity_id', v)}
              options={[{ value: '', label: 'Select Entity…' }, ...entities]}
              placeholder="Select Entity…"
              disabled={ro}
            />
          </Form.Item>
          <Form.Item
            name="vendor_id"
            label={wrapLabel('Vendor')}
            rules={[{ required: true, message: 'Please select vendor' }]}
          >
            <Select
              value={local.vendor_id}
              onChange={(v) => setField('vendor_id', v)}
              options={[{ value: '', label: 'Select Vendor…' }, ...vendors]}
              placeholder="Select Vendor…"
              disabled={ro}
            />
          </Form.Item>
          <Form.Item name="vendor_site_id" label={wrapLabel('Vendor site')}>
            <Select
              value={local.vendor_site_id}
              onChange={(v) => setField('vendor_site_id', v)}
              options={[
                {
                  value: '',
                  label: local.vendor_id
                    ? vendorSitesLoading
                      ? 'Loading sites…'
                      : vendorSites.length === 0
                        ? 'No sites for this vendor'
                        : 'Select Site…'
                    : 'Select Vendor first…',
                },
                ...vendorSites,
              ]}
              placeholder={
                local.vendor_id ? 'Select Site…' : 'Select Vendor first…'
              }
              disabled={ro || !local.vendor_id || vendorSitesLoading}
            />
          </Form.Item>
          <Form.Item name="item_type_id" label={wrapLabel('Item type')}>
            <Select
              value={local.item_type_id}
              onChange={(v) => setField('item_type_id', v)}
              options={[
                { value: '', label: 'Select Item Type…' },
                ...itemTypes,
              ]}
              placeholder="Select Item Type…"
              disabled={ro}
            />
          </Form.Item>
          <Form.Item
            name="shipping_selection"
            label={wrapLabel('Shipping address')}
          >
            <Select
              value={local.shipping_selection}
              onChange={(v) => setField('shipping_selection', v)}
              options={[
                {
                  value: '',
                  label: !local.entity_id
                    ? 'Select Entity first…'
                    : entityAddrLoading
                      ? 'Loading addresses…'
                      : shippingSelectOptions.length === 0
                        ? 'No shipping addresses on entity'
                        : 'Select shipping address',
                },
                ...shippingSelectOptions,
              ]}
              placeholder="Select shipping address"
              disabled={
                ro || !local.entity_id || entityAddrLoading
              }
            />
          </Form.Item>
          <Form.Item
            name="billing_selection"
            label={wrapLabel('Billing address')}
          >
            <Select
              value={local.billing_selection}
              onChange={(v) => setField('billing_selection', v)}
              options={[
                {
                  value: '',
                  label: !local.entity_id
                    ? 'Select Entity first…'
                    : entityAddrLoading
                      ? 'Loading addresses…'
                      : billingSelectOptions.length === 0
                        ? 'No billing addresses on entity'
                        : 'Select billing address',
                },
                ...billingSelectOptions,
              ]}
              placeholder="Select billing address"
              disabled={
                ro || !local.entity_id || entityAddrLoading
              }
            />
          </Form.Item>
          <Form.Item name="currency_id" label={wrapLabel('RC currency (Oracle)')}>
            <Select
              value={local.currency_id}
              onChange={(v) => setField('currency_id', v)}
              options={[{ value: '', label: 'Select Currency…' }, ...currencies]}
              placeholder="Select Currency…"
              disabled={ro}
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Validity &amp; schedule</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <Form.Item label={wrapLabel('Validity from')}>
            <DatePicker
              value={toDayjs(local.validity_from)}
              onChange={(d) => setField('validity_from', fromDayjs(d))}
              format={DATE_FORMAT}
              placeholder="Select date"
              allowClear
              disabled={ro}
              className={FIELD_INPUT_CLASS + ' w-full !px-3 border'}
            />
          </Form.Item>
          <Form.Item label={wrapLabel('Validity to')}>
            <DatePicker
              value={toDayjs(local.validity_to)}
              onChange={(d) => setField('validity_to', fromDayjs(d))}
              format={DATE_FORMAT}
              placeholder="Select date"
              allowClear
              disabled={ro}
              disabledDate={(current) => {
                const from = toDayjs(local.validity_from);
                return !!(current && from && current.isBefore(from, 'day'));
              }}
              className={FIELD_INPUT_CLASS + ' w-full !px-3 border'}
            />
          </Form.Item>
          <Form.Item label={wrapLabel('Required date')}>
            <DatePicker
              value={toDayjs(local.required_date)}
              onChange={(d) => setField('required_date', fromDayjs(d))}
              format={DATE_FORMAT}
              placeholder="Select date"
              allowClear
              disabled={ro}
              className={FIELD_INPUT_CLASS + ' w-full !px-3 border'}
            />
          </Form.Item>
          <Form.Item name="frequency" label={wrapLabel('Frequency')}>
            <Select
              value={local.frequency}
              onChange={(v) => setField('frequency', v)}
              options={FREQUENCY_OPTIONS}
              placeholder="Frequency…"
              disabled={ro}
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Organisation</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <Form.Item name="department_id" label={wrapLabel('Department')}>
            <Select
              value={local.department_id}
              onChange={(v) => setField('department_id', v)}
              options={[
                { value: '', label: 'Select Department…' },
                ...departments,
              ]}
              placeholder="Select Department…"
              disabled={ro}
            />
          </Form.Item>
          <Form.Item
            name="subdepartment_id"
            label={wrapLabel('Sub-department')}
            rules={
              ro
                ? []
                : [
                    {
                      required: true,
                      message:
                        'Sub-department is required for the approval workflow.',
                    },
                  ]
            }
          >
            <Select
              value={local.subdepartment_id}
              onChange={(v) => setField('subdepartment_id', v)}
              options={[
                {
                  value: '',
                  label: local.department_id
                    ? 'Select Sub-department…'
                    : 'Select Department first…',
                },
                ...filteredSubdepartments,
              ]}
              placeholder={
                local.department_id
                  ? 'Select Sub-department…'
                  : 'Select Department first…'
              }
              disabled={ro || !local.department_id}
            />
          </Form.Item>
          <Form.Item name="payment_term_id" label={wrapLabel('Payment term')}>
            <Select
              value={local.payment_term_id}
              onChange={(v) => setField('payment_term_id', v)}
              options={[
                { value: '', label: 'Select Payment Term…' },
                ...paymentTerms,
              ]}
              placeholder="Select Payment Term…"
              disabled={ro}
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Terms &amp; conditions</p>
        <Form.Item name="terms_condition_id" label={wrapLabel('Library')}>
          <Select
            value={local.terms_condition_id}
            onChange={(v) => setField('terms_condition_id', v)}
            options={[
              { value: '', label: 'Select terms…' },
              ...termsConditions,
            ]}
            placeholder="Select terms & conditions"
            disabled={ro}
          />
        </Form.Item>
      </div>

      <div className={SECTION_DIVIDER}>
        <div className="flex items-center justify-between mb-4">
          <p className={SECTION_TITLE + ' !mb-0'}>Items</p>
          {!ro && (
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
            >
              <Plus size={14} /> Add item
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-56">
                  Item
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-44">
                  Center
                </th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Qty
                </th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Rate (₹)
                </th>
                <th className="px-2 py-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Base amount
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Remarks
                </th>
                {!ro && <th className="px-3 py-2 text-center w-12"> </th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 hover:bg-slate-50/50"
                >
                  <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                  <td className="px-2 py-1.5">
                    <Select
                      value={row.item_id ? String(row.item_id) : ''}
                      onChange={(v) =>
                        updateRow(index, { item_id: v ? Number(v) : null })
                      }
                      options={[
                        { value: '', label: 'Select Item…' },
                        ...items,
                      ]}
                      placeholder="Select Item…"
                      size="sm"
                      disabled={ro}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      value={row.description}
                      onChange={(e) =>
                        updateRow(index, { description: e.target.value })
                      }
                      placeholder="Description"
                      className="rounded-lg soft-input"
                      readOnly={ro}
                      disabled={ro}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Select
                      value={row.center_id ? String(row.center_id) : ''}
                      onChange={(v) =>
                        updateRow(index, {
                          center_id: v ? Number(v) : null,
                        })
                      }
                      options={[
                        { value: '', label: 'Center…' },
                        ...centers,
                      ]}
                      placeholder="Center…"
                      size="sm"
                      disabled={ro}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <InputNumber
                      value={row.quantity}
                      onChange={(value) =>
                        updateRow(index, { quantity: Number(value ?? 0) })
                      }
                      min={0}
                      precision={2}
                      controls={false}
                      className="w-full rounded-lg pr-num-input"
                      readOnly={ro}
                      disabled={ro}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <InputNumber
                      value={row.rate}
                      onChange={(value) =>
                        updateRow(index, { rate: Number(value ?? 0) })
                      }
                      min={0}
                      precision={2}
                      controls={false}
                      className="w-full rounded-lg pr-num-input"
                      readOnly={ro}
                      disabled={ro}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center text-sm font-medium text-gray-700 tabular-nums">
                    ₹ {Number(row.amount).toFixed(2)}
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      value={row.remarks}
                      onChange={(e) =>
                        updateRow(index, { remarks: e.target.value })
                      }
                      placeholder="Remarks"
                      className="rounded-lg soft-input"
                      readOnly={ro}
                      disabled={ro}
                    />
                  </td>
                  {!ro && (
                    <td className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Remove row ${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-slate-50">
                <td colSpan={6} className="px-3 py-2 text-right font-semibold">
                  Net total amount
                </td>
                <td className="px-2 py-2 text-center font-semibold text-emerald-700 tabular-nums">
                  ₹ {totalNet.toFixed(2)}
                </td>
                <td className="px-2 py-2" />
                {!ro && <td className="px-2 py-2" />}
              </tr>
            </tbody>
          </table>
        </div>
        {itemsError && (
          <p className="text-xs text-red-500 mt-2">{itemsError}</p>
        )}
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Overall summary</p>
        <Form.Item name="overall_summary" label={wrapLabel('Summary')}>
          <Input.TextArea
            rows={3}
            placeholder="Summary visible to approver"
            className="rounded-xl soft-input"
            readOnly={ro}
            disabled={ro}
          />
        </Form.Item>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default RateContractAdd;
