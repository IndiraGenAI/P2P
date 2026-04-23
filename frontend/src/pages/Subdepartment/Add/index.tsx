import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { ISubdepartmentRecord } from '../Subdepartment.model';
import type { ISubdepartmentAddProps } from './Add.model';

const rules = {
  name: [
    { required: true, message: 'Please enter subdepartment name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
  code: [
    { required: true, message: 'Please enter subdepartment code' },
    { max: 20, message: 'Code must be at most 20 characters' },
  ],
  department_id: [{ required: true, message: 'Please select a department' }],
};

const SubdepartmentAdd = (props: ISubdepartmentAddProps) => {
  const { data, onSubmit, myRef, departments } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      name: data?.name ?? '',
      code: data?.code ?? '',
      department_id: data?.department_id
        ? String(data.department_id)
        : undefined,
    }),
    [data],
  );

  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    initialValues.department_id ?? '',
  );

  useEffect(() => {
    form.resetFields();
    setSelectedDepartment(initialValues.department_id ?? '');
  }, [initialValues]);

  const onFinish = (values: {
    name: string;
    code: string;
    department_id: string;
  }) => {
    const trimmed = trimObject(values);
    const payload: ISubdepartmentRecord = {
      id: data?.id ?? 0,
      name: trimmed.name,
      code: trimmed.code,
      department_id: Number(trimmed.department_id),
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
          name="department_id"
          rules={rules.department_id}
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Department
            </span>
          }
        >
          <Select
            value={selectedDepartment}
            onChange={(v) => {
              setSelectedDepartment(v);
              form.setFieldsValue({ department_id: v });
            }}
            options={departments}
            placeholder="Select department"
          />
        </Form.Item>
      </div>

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
          placeholder="e.g. Accounts Payable"
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
          placeholder="e.g. AP"
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

export default SubdepartmentAdd;
