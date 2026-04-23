import { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { ITdsRecord } from '../Tds.model';
import type { ITdsAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter TDS code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter TDS name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
  percentage: [
    { required: true, message: 'Please enter percentage' },
    {
      type: 'number' as const,
      min: 0,
      max: 100,
      message: 'Percentage must be between 0 and 100',
    },
  ],
};

const TdsAdd = (props: ITdsAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      percentage:
        data?.percentage !== undefined && data?.percentage !== null
          ? Number(data.percentage)
          : undefined,
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: {
    code: string;
    name: string;
    percentage: number;
  }) => {
    const trimmed = trimObject(values);
    const payload: ITdsRecord = {
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      percentage: Number(values.percentage),
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
          placeholder="e.g. 194C"
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
          placeholder="e.g. TDS on Contract"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="percentage"
        rules={rules.percentage}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Percentage (%)
          </span>
        }
      >
        <InputNumber
          placeholder="e.g. 2"
          className="!w-full rounded-xl soft-input !py-1"
          size="large"
          min={0}
          max={100}
          step={0.01}
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default TdsAdd;
