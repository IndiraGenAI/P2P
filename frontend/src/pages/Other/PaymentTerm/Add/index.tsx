import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { IPaymentTermRecord } from '../PaymentTerm.model';
import type { IPaymentTermAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter payment term code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter payment term name' },
    { min: 1, max: 100, message: 'Name must be 1-100 characters' },
  ],
  oracle_code: [{ max: 100, message: 'Oracle code must be at most 100 characters' }],
};

const PaymentTermAdd = (props: IPaymentTermAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      oracle_code: data?.oracle_code ?? '',
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: {
    code: string;
    name: string;
    oracle_code?: string;
  }) => {
    const trimmed = trimObject(values);
    onSubmit({
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      oracle_code: trimmed.oracle_code || undefined,
      status: data?.status,
    });
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
          placeholder="e.g. NET30"
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
          placeholder="e.g. Net 30 Days"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="oracle_code"
        rules={rules.oracle_code}
        className="md:col-span-2"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Oracle Code
          </span>
        }
      >
        <Input
          placeholder="Optional Oracle reference"
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

export default PaymentTermAdd;
