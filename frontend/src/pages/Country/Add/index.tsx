import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { ICountryRecord } from '../Country.model';
import type { ICountryAddProps } from './Add.model';

const rules = {
  name: [
    { required: true, message: 'Please enter country name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
};

const CountryAdd = (props: ICountryAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({ name: data?.name ?? '' }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: { name: string }) => {
    const trimmed = trimObject(values);
    const payload: ICountryRecord = {
      id: data?.id ?? 0,
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
      className="space-y-2"
    >
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
          placeholder="e.g. India"
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

export default CountryAdd;
