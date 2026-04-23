import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { ICurrencyRecord } from '../Currency.model';
import type { ICurrencyAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter currency code' },
    { max: 10, message: 'Code must be at most 10 characters' },
  ],
  name: [
    { required: true, message: 'Please enter currency name' },
    { min: 2, max: 50, message: 'Name must be 2-50 characters' },
  ],
  symbol: [{ max: 10, message: 'Symbol must be at most 10 characters' }],
};

const CurrencyAdd = (props: ICurrencyAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      symbol: data?.symbol ?? '',
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: { code: string; name: string; symbol?: string }) => {
    const trimmed = trimObject(values);
    const payload: ICurrencyRecord = {
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      symbol: trimmed.symbol || null,
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
          placeholder="e.g. USD"
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
          placeholder="e.g. US Dollar"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="symbol"
        rules={rules.symbol}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Symbol
          </span>
        }
      >
        <Input
          placeholder="e.g. $"
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

export default CurrencyAdd;
