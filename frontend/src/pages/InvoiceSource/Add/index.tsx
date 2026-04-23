import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { IInvoiceSourceRecord } from '../InvoiceSource.model';
import type { IInvoiceSourceAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter invoice source code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter invoice source name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
};

const InvoiceSourceAdd = (props: IInvoiceSourceAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: { code: string; name: string }) => {
    const trimmed = trimObject(values);
    const payload: IInvoiceSourceRecord = {
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      status: data?.status,
    };
    onSubmit(payload);
  };

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
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Code
          </span>
        }
      >
        <Input
          placeholder="e.g. INV-MANUAL"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="name"
        rules={rules.name}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Name
          </span>
        }
      >
        <Input
          placeholder="e.g. Manual Entry"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default InvoiceSourceAdd;
