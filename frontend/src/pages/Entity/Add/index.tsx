import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { trimObject } from '@/utils/helperFunction';
import type { IEntityRecord } from '../Entity.model';
import type { IEntityAddProps } from './Add.model';

const { TextArea } = Input;

const rules = {
  code: [
    { required: true, message: 'Please enter entity code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter entity name' },
    { min: 2, max: 150, message: 'Name must be 2-150 characters' },
  ],
  business_unit: [{ max: 100, message: 'Must be at most 100 characters' }],
  legal_entity: [{ max: 150, message: 'Must be at most 150 characters' }],
  liability_distribution: [
    { max: 255, message: 'Must be at most 255 characters' },
  ],
  prepayment_distribution: [
    { max: 255, message: 'Must be at most 255 characters' },
  ],
  address: [{ max: 500, message: 'Address must be at most 500 characters' }],
};

interface FormShape {
  code: string;
  name: string;
  business_unit?: string;
  legal_entity?: string;
  liability_distribution?: string;
  prepayment_distribution?: string;
  shipping_addresses?: { value: string }[];
  billing_addresses?: { value: string }[];
}

const toFieldArray = (
  values?: string[] | null,
): { value: string }[] => (values ?? []).map((v) => ({ value: v }));

const fromFieldArray = (
  rows?: { value: string }[],
): string[] =>
  (rows ?? [])
    .map((r) => (typeof r?.value === 'string' ? r.value.trim() : ''))
    .filter((v) => v.length > 0);

const EntityAdd = (props: IEntityAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm<FormShape>();

  const initialValues = useMemo<FormShape>(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      business_unit: data?.business_unit ?? '',
      legal_entity: data?.legal_entity ?? '',
      liability_distribution: data?.liability_distribution ?? '',
      prepayment_distribution: data?.prepayment_distribution ?? '',
      shipping_addresses: toFieldArray(data?.shipping_addresses),
      billing_addresses: toFieldArray(data?.billing_addresses),
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: FormShape) => {
    const trimmed = trimObject({
      code: values.code,
      name: values.name,
      business_unit: values.business_unit,
      legal_entity: values.legal_entity,
      liability_distribution: values.liability_distribution,
      prepayment_distribution: values.prepayment_distribution,
    }) as Partial<FormShape>;

    const payload: IEntityRecord = {
      id: data?.id ?? 0,
      code: trimmed.code ?? '',
      name: trimmed.name ?? '',
      business_unit: trimmed.business_unit || null,
      legal_entity: trimmed.legal_entity || null,
      liability_distribution: trimmed.liability_distribution || null,
      prepayment_distribution: trimmed.prepayment_distribution || null,
      shipping_addresses: fromFieldArray(values.shipping_addresses),
      billing_addresses: fromFieldArray(values.billing_addresses),
      status: data?.status,
    };
    onSubmit(payload);
  };

  const labelClass =
    'text-xs font-semibold text-gray-700 uppercase tracking-wider';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-5"
    >
      <Form.Item
        name="code"
        rules={rules.code}
        label={<span className={labelClass}>Code</span>}
      >
        <Input
          placeholder="e.g. ENT-001"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="name"
        rules={rules.name}
        label={<span className={labelClass}>Name</span>}
      >
        <Input
          placeholder="e.g. Acme Corporation"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="business_unit"
        rules={rules.business_unit}
        label={<span className={labelClass}>Business Unit</span>}
      >
        <Input
          placeholder="e.g. Finance BU"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="legal_entity"
        rules={rules.legal_entity}
        label={<span className={labelClass}>Legal Entity</span>}
      >
        <Input
          placeholder="e.g. Acme Corporation Pvt Ltd"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="liability_distribution"
        rules={rules.liability_distribution}
        label={<span className={labelClass}>Liability Distribution</span>}
      >
        <Input
          placeholder="e.g. 01-2000-0000-000-000"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="prepayment_distribution"
        rules={rules.prepayment_distribution}
        label={<span className={labelClass}>Prepayment Distribution</span>}
      >
        <Input
          placeholder="e.g. 01-1500-0000-000-000"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>Shipping Addresses</span>
        </div>
        <Form.List name="shipping_addresses">
          {(fields, { add, remove }) => (
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start gap-2">
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    rules={rules.address}
                    className="flex-1 mb-0"
                  >
                    <TextArea
                      placeholder="Enter shipping address"
                      className="rounded-xl soft-input !py-2"
                      autoSize={{ minRows: 1, maxRows: 3 }}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    onClick={() => remove(field.name)}
                    aria-label="Remove shipping address"
                    className="mt-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => add({ value: '' })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                <Plus size={12} /> Add shipping address
              </button>
            </div>
          )}
        </Form.List>
      </div>

      <div className="md:col-span-2 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>Billing Addresses</span>
        </div>
        <Form.List name="billing_addresses">
          {(fields, { add, remove }) => (
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start gap-2">
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    rules={rules.address}
                    className="flex-1 mb-0"
                  >
                    <TextArea
                      placeholder="Enter billing address"
                      className="rounded-xl soft-input !py-2"
                      autoSize={{ minRows: 1, maxRows: 3 }}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    onClick={() => remove(field.name)}
                    aria-label="Remove billing address"
                    className="mt-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => add({ value: '' })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                <Plus size={12} /> Add billing address
              </button>
            </div>
          )}
        </Form.List>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default EntityAdd;
