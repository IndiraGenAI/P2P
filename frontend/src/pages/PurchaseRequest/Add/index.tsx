import { useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import type { IPurchaseRequestRecord } from '../PurchaseRequest.model';
import type { IPurchaseRequestAddProps } from './Add.model';

const SECTION_TITLE =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-400 uppercase mb-4';
const SECTION_DIVIDER = 'border-t border-gray-200 pt-6 mt-2';
const FIELD_INPUT_CLASS = 'rounded-xl soft-input !py-2.5';

const wrapLabel = (label: string) => (
  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
    {label}
  </span>
);

const FREQUENCY_OPTIONS = [
  { value: '', label: 'Frequency…' },
  { value: 'ONE_TIME', label: 'One Time' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'HALF_YEARLY', label: 'Half Yearly' },
  { value: 'YEARLY', label: 'Yearly' },
];

interface ItemRowDraft {
  id?: number;
  item_id: number | null;
  description: string;
  quantity: number;
  estimated_rate: number;
  amount: number;
  remarks: string;
}

const emptyRow = (): ItemRowDraft => ({
  item_id: null,
  description: '',
  quantity: 1,
  estimated_rate: 0,
  amount: 0,
  remarks: '',
});

interface FormValues {
  pr_number: string;
  entity_id: string;
  vendor_id: string;
  vendor_site_id: string;
  item_type_id: string;
  department_id: string;
  subdepartment_id: string;
  payment_term_id: string;
  center_id: string;
  validity_from: string;
  validity_to: string;
  required_date: string;
  frequency: string;
  remarks: string;
  terms_conditions: string;
  overall_summary: string;
}

const PurchaseRequestAdd = (props: IPurchaseRequestAddProps) => {
  const {
    data,
    onSubmit,
    myRef,
    vendors,
    vendorSites,
    entities,
    itemTypes,
    departments,
    subdepartments,
    paymentTerms,
    centers,
    items,
  } = props;
  const [form] = Form.useForm<FormValues>();
  const isEdit = !!data?.id;

  const initialValues = useMemo<FormValues>(
    () => ({
      pr_number: data?.pr_number ?? '',
      entity_id: data?.entity_id ? String(data.entity_id) : '',
      vendor_id: data?.vendor_id ? String(data.vendor_id) : '',
      vendor_site_id: data?.vendor_site_id ? String(data.vendor_site_id) : '',
      item_type_id: data?.item_type_id ? String(data.item_type_id) : '',
      department_id: data?.department_id ? String(data.department_id) : '',
      subdepartment_id: data?.subdepartment_id
        ? String(data.subdepartment_id)
        : '',
      payment_term_id: data?.payment_term_id
        ? String(data.payment_term_id)
        : '',
      center_id: data?.center_id ? String(data.center_id) : '',
      validity_from: data?.validity_from ?? '',
      validity_to: data?.validity_to ?? '',
      required_date: data?.required_date ?? '',
      frequency: data?.frequency ?? '',
      remarks: data?.remarks ?? '',
      terms_conditions: data?.terms_conditions ?? '',
      overall_summary: data?.overall_summary ?? '',
    }),
    [data],
  );

  const [local, setLocal] = useState<FormValues>(initialValues);
  const [rows, setRows] = useState<ItemRowDraft[]>(() =>
    data?.items?.length
      ? data.items.map((item) => ({
          id: item.id,
          item_id: item.item_id ?? null,
          description: item.description ?? '',
          quantity: Number(item.quantity ?? 0),
          estimated_rate: Number(item.estimated_rate ?? 0),
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
            quantity: Number(item.quantity ?? 0),
            estimated_rate: Number(item.estimated_rate ?? 0),
            amount: Number(item.amount ?? 0),
            remarks: item.remarks ?? '',
          }))
        : [emptyRow()],
    );
    setItemsError('');
  }, [initialValues]);

  const setField = (key: keyof FormValues, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    form.setFieldsValue({ [key]: value } as Partial<FormValues>);
  };

  const updateRow = (index: number, patch: Partial<ItemRowDraft>) => {
    setRows((prev) => {
      const next = [...prev];
      const merged = { ...next[index], ...patch };
      const hasQty = patch.quantity !== undefined;
      const hasRate = patch.estimated_rate !== undefined;
      if (hasQty || hasRate) {
        merged.amount =
          Number(merged.quantity ?? 0) * Number(merged.estimated_rate ?? 0);
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
    if (!rows.length) {
      setItemsError('Please add at least one item.');
      return;
    }
    const invalidIndex = rows.findIndex(
      (r) => Number(r.quantity) <= 0 || Number(r.estimated_rate) < 0,
    );
    if (invalidIndex >= 0) {
      setItemsError(
        `Row ${invalidIndex + 1}: quantity must be > 0 and rate must be >= 0.`,
      );
      return;
    }
    setItemsError('');

    const payload: IPurchaseRequestRecord = {
      id: data?.id ?? 0,
      pr_number: values.pr_number?.trim() || undefined,
      entity_id: values.entity_id ? Number(values.entity_id) : null,
      vendor_id: values.vendor_id ? Number(values.vendor_id) : null,
      vendor_site_id: values.vendor_site_id
        ? Number(values.vendor_site_id)
        : null,
      item_type_id: values.item_type_id ? Number(values.item_type_id) : null,
      department_id: values.department_id ? Number(values.department_id) : null,
      subdepartment_id: values.subdepartment_id
        ? Number(values.subdepartment_id)
        : null,
      payment_term_id: values.payment_term_id
        ? Number(values.payment_term_id)
        : null,
      center_id: values.center_id ? Number(values.center_id) : null,
      validity_from: values.validity_from || null,
      validity_to: values.validity_to || null,
      required_date: values.required_date || null,
      frequency: values.frequency || null,
      remarks: values.remarks?.trim() || null,
      terms_conditions: values.terms_conditions?.trim() || null,
      overall_summary: values.overall_summary?.trim() || null,
      status: data?.status ?? 'DRAFT',
      net_amount: totalNet,
      items: rows.map((r) => ({
        id: r.id,
        item_id: r.item_id ?? null,
        description: r.description?.trim() || null,
        quantity: Number(r.quantity ?? 0),
        estimated_rate: Number(r.estimated_rate ?? 0),
        amount: Number(r.amount ?? 0),
        remarks: r.remarks?.trim() || null,
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
      {/* ───── Header ───── */}
      <div>
        <p className={SECTION_TITLE}>Header</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item
            name="pr_number"
            label={wrapLabel('PR Number (Auto-generated)')}
          >
            <Input
              placeholder="Auto-generated"
              className={FIELD_INPUT_CLASS}
              size="large"
              disabled={!isEdit}
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
            />
          </Form.Item>
          <Form.Item
            name="vendor_site_id"
            label={wrapLabel('Vendor Site')}
          >
            <Select
              value={local.vendor_site_id}
              onChange={(v) => setField('vendor_site_id', v)}
              options={[
                { value: '', label: 'Select Site…' },
                ...vendorSites,
              ]}
              placeholder="Select Site…"
            />
          </Form.Item>
          <Form.Item name="entity_id" label={wrapLabel('Entity')}>
            <Select
              value={local.entity_id}
              onChange={(v) => setField('entity_id', v)}
              options={[{ value: '', label: 'Select Entity…' }, ...entities]}
              placeholder="Select Entity…"
            />
          </Form.Item>
          <Form.Item name="item_type_id" label={wrapLabel('Item Type')}>
            <Select
              value={local.item_type_id}
              onChange={(v) => setField('item_type_id', v)}
              options={[
                { value: '', label: 'Select Item Type…' },
                ...itemTypes,
              ]}
              placeholder="Select Item Type…"
            />
          </Form.Item>
          <Form.Item name="payment_term_id" label={wrapLabel('Payment Term')}>
            <Select
              value={local.payment_term_id}
              onChange={(v) => setField('payment_term_id', v)}
              options={[
                { value: '', label: 'Select Payment Term…' },
                ...paymentTerms,
              ]}
              placeholder="Select Payment Term…"
            />
          </Form.Item>
        </div>
      </div>

      {/* ───── Dates & frequency ───── */}
      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Validity & Schedule</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <Form.Item name="validity_from" label={wrapLabel('Validity From')}>
            <input
              type="date"
              value={local.validity_from}
              onChange={(e) => setField('validity_from', e.target.value)}
              className={FIELD_INPUT_CLASS + ' w-full px-3 border'}
            />
          </Form.Item>
          <Form.Item name="validity_to" label={wrapLabel('Validity To')}>
            <input
              type="date"
              value={local.validity_to}
              onChange={(e) => setField('validity_to', e.target.value)}
              className={FIELD_INPUT_CLASS + ' w-full px-3 border'}
            />
          </Form.Item>
          <Form.Item name="required_date" label={wrapLabel('Required Date')}>
            <input
              type="date"
              value={local.required_date}
              onChange={(e) => setField('required_date', e.target.value)}
              className={FIELD_INPUT_CLASS + ' w-full px-3 border'}
            />
          </Form.Item>
          <Form.Item name="frequency" label={wrapLabel('Frequency')}>
            <Select
              value={local.frequency}
              onChange={(v) => setField('frequency', v)}
              options={FREQUENCY_OPTIONS}
              placeholder="Frequency…"
            />
          </Form.Item>
        </div>
      </div>

      {/* ───── Org ───── */}
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
            />
          </Form.Item>
          <Form.Item
            name="subdepartment_id"
            label={wrapLabel('Sub-department')}
          >
            <Select
              value={local.subdepartment_id}
              onChange={(v) => setField('subdepartment_id', v)}
              options={[
                { value: '', label: 'Select Sub-department…' },
                ...subdepartments,
              ]}
              placeholder="Select Sub-department…"
            />
          </Form.Item>
          <Form.Item name="center_id" label={wrapLabel('Center')}>
            <Select
              value={local.center_id}
              onChange={(v) => setField('center_id', v)}
              options={[{ value: '', label: 'Select Center…' }, ...centers]}
              placeholder="Select Center…"
            />
          </Form.Item>
        </div>
      </div>

      {/* ───── Items ───── */}
      <div className={SECTION_DIVIDER}>
        <div className="flex items-center justify-between mb-4">
          <p className={SECTION_TITLE + ' !mb-0'}>Items</p>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
          >
            <Plus size={14} /> Add Item
          </button>
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
                <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Qty
                </th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Rate
                </th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Amount
                </th>
                <th className="px-3 py-2 text-center w-12"> </th>
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
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <InputNumber
                      value={row.estimated_rate}
                      onChange={(value) =>
                        updateRow(index, {
                          estimated_rate: Number(value ?? 0),
                        })
                      }
                      min={0}
                      precision={2}
                      controls={false}
                      className="w-full rounded-lg pr-num-input"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right text-sm font-medium text-gray-700">
                    {Number(row.amount).toFixed(2)}
                  </td>
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
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-slate-50">
                <td colSpan={5} className="px-3 py-2 text-right font-semibold">
                  Net Amount
                </td>
                <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                  {totalNet.toFixed(2)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        {itemsError && (
          <p className="text-xs text-red-500 mt-2">{itemsError}</p>
        )}
      </div>

      {/* ───── Notes ───── */}
      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Notes</p>
        <Form.Item name="remarks" label={wrapLabel('Remarks')}>
          <Input.TextArea
            rows={2}
            placeholder="Internal remarks"
            className="rounded-xl soft-input"
          />
        </Form.Item>
        <Form.Item name="terms_conditions" label={wrapLabel('Terms & Conditions')}>
          <Input.TextArea
            rows={3}
            placeholder="Payment terms, delivery terms, etc."
            className="rounded-xl soft-input"
          />
        </Form.Item>
        <Form.Item name="overall_summary" label={wrapLabel('Overall Summary')}>
          <Input.TextArea
            rows={2}
            placeholder="Summary visible to approver"
            className="rounded-xl soft-input"
          />
        </Form.Item>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default PurchaseRequestAdd;
