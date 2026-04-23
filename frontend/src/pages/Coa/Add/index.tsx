import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { ICoaRecord } from '../Coa.model';
import type { ICoaAddProps } from './Add.model';

const { TextArea } = Input;

const rules = {
  coa_category_id: [{ required: true, message: 'Please select a category' }],
  gl_code: [
    { required: true, message: 'Please enter GL code' },
    { max: 50, message: 'GL code must be at most 50 characters' },
  ],
  gl_name: [
    { required: true, message: 'Please enter GL name' },
    { min: 2, max: 150, message: 'GL name must be 2-150 characters' },
  ],
  distribution_combination: [
    { required: true, message: 'Please enter distribution combination' },
    { max: 255, message: 'Must be at most 255 characters' },
  ],
};

const CoaAdd = (props: ICoaAddProps) => {
  const { data, onSubmit, myRef, categories } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      coa_category_id: data?.coa_category_id
        ? String(data.coa_category_id)
        : undefined,
      gl_code: data?.gl_code ?? '',
      gl_name: data?.gl_name ?? '',
      distribution_combination: data?.distribution_combination ?? '',
    }),
    [data],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialValues.coa_category_id ?? '',
  );

  useEffect(() => {
    form.resetFields();
    setSelectedCategory(initialValues.coa_category_id ?? '');
  }, [initialValues]);

  const onFinish = (values: {
    coa_category_id: string;
    gl_code: string;
    gl_name: string;
    distribution_combination: string;
  }) => {
    const trimmed = trimObject(values);
    const payload: ICoaRecord = {
      id: data?.id ?? 0,
      coa_category_id: Number(trimmed.coa_category_id),
      gl_code: trimmed.gl_code,
      gl_name: trimmed.gl_name,
      distribution_combination: trimmed.distribution_combination,
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
      <div className="md:col-span-2">
        <Form.Item
          name="coa_category_id"
          rules={rules.coa_category_id}
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              COA Category
            </span>
          }
        >
          <Select
            value={selectedCategory}
            onChange={(v) => {
              setSelectedCategory(v);
              form.setFieldsValue({ coa_category_id: v });
            }}
            options={categories}
            placeholder="Select category"
          />
        </Form.Item>
      </div>

      <Form.Item
        name="gl_code"
        rules={rules.gl_code}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            GL Code
          </span>
        }
      >
        <Input
          placeholder="e.g. 1000-000"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="gl_name"
        rules={rules.gl_name}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            GL Name
          </span>
        }
      >
        <Input
          placeholder="e.g. Cash in Hand"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <div className="md:col-span-2">
        <Form.Item
          name="distribution_combination"
          rules={rules.distribution_combination}
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Distribution Combination
            </span>
          }
        >
          <TextArea
            placeholder="e.g. 01-1000-0000-000-000"
            className="rounded-xl soft-input !py-2"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default CoaAdd;
