import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { ITermsConditionAddProps } from './Add.model';

const { TextArea } = Input;

const rules = {
  code: [
    { required: true, message: 'Please enter terms & condition code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter terms & condition name' },
    { min: 1, max: 100, message: 'Name must be 1-100 characters' },
  ],
  description: [
    { max: 5000, message: 'Description must be at most 5000 characters' },
  ],
};

const TermsConditionAdd = (props: ITermsConditionAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      description: data?.description ?? '',
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: {
    code: string;
    name: string;
    description?: string;
  }) => {
    const trimmed = trimObject(values);
    onSubmit({
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      description: trimmed.description || undefined,
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
          placeholder="e.g. TC-STD"
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
          placeholder="e.g. Standard Terms & Conditions"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="description"
        rules={rules.description}
        className="md:col-span-2"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Description
          </span>
        }
      >
        <TextArea
          placeholder="Optional detailed description"
          className="rounded-xl soft-input !py-2"
          autoSize={{ minRows: 4, maxRows: 10 }}
          maxLength={5000}
          showCount
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default TermsConditionAdd;
