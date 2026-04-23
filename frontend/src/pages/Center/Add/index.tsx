import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { ICenterRecord } from '../Center.model';
import type { ICenterAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter center code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter center name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
};

const CenterAdd = (props: ICenterAddProps) => {
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
    const payload: ICenterRecord = {
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
          placeholder="e.g. CTR-001"
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
          placeholder="e.g. Mumbai Center"
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

export default CenterAdd;
