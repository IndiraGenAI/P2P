import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { IZoneRecord } from '../Zone.model';
import type { IZoneAddProps } from './Add.model';

const rules = {
  name: [
    { required: true, message: 'Please enter zone name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
  code: [{ max: 20, message: 'Code must be at most 20 characters' }],
  country_id: [{ required: true, message: 'Please select a country' }],
};

const ZoneAdd = (props: IZoneAddProps) => {
  const { data, onSubmit, myRef, countries } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      name: data?.name ?? '',
      code: data?.code ?? '',
      country_id: data?.country_id ? String(data.country_id) : undefined,
    }),
    [data],
  );

  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialValues.country_id ?? '',
  );

  useEffect(() => {
    form.resetFields();
    setSelectedCountry(initialValues.country_id ?? '');
  }, [initialValues]);

  const onFinish = (values: {
    name: string;
    code?: string;
    country_id: string;
  }) => {
    const trimmed = trimObject(values);
    const payload: IZoneRecord = {
      id: data?.id ?? 0,
      name: trimmed.name,
      code: trimmed.code ? trimmed.code : null,
      country_id: Number(trimmed.country_id),
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
        name="country_id"
        rules={rules.country_id}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Country
          </span>
        }
      >
        <Select
          value={selectedCountry}
          onChange={(v) => {
            setSelectedCountry(v);
            form.setFieldsValue({ country_id: v });
          }}
          options={countries}
          placeholder="Select country"
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
          placeholder="e.g. West Zone"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

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
          placeholder="e.g. WZ"
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

export default ZoneAdd;
