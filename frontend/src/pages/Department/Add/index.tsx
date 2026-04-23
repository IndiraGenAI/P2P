import { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';
import type { IDepartmentRecord } from '../Department.model';
import type { IDepartmentAddProps } from './Add.model';

const rules = {
  name: [
    { required: true, message: 'Please enter department name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
  code: [
    { required: true, message: 'Please enter department code' },
    { max: 20, message: 'Code must be at most 20 characters' },
  ],
};

const DepartmentAdd = (props: IDepartmentAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      name: data?.name ?? '',
      code: data?.code ?? '',
    }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: { name: string; code: string }) => {
    const trimmed = trimObject(values);
    const payload: IDepartmentRecord = {
      id: data?.id ?? 0,
      name: trimmed.name,
      code: trimmed.code,
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
        name="name"
        rules={rules.name}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Name
          </span>
        }
      >
        <Input
          placeholder="e.g. Finance"
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
          placeholder="e.g. FIN"
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

export default DepartmentAdd;
