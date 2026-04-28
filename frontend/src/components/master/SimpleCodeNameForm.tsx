import { useEffect, useMemo, type Ref } from 'react';
import { Form, Input } from 'antd';
import { trimObject } from '@/utils/helperFunction';

export interface ISimpleCodeNameRecord {
  id: number;
  code: string;
  name: string;
  status?: boolean;
}

export interface ISimpleCodeNameFormProps<T extends ISimpleCodeNameRecord> {
  data?: T;
  onSubmit: (value: T) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  codePlaceholder?: string;
  namePlaceholder?: string;
  codeLabel?: string;
  nameLabel?: string;
}

export function SimpleCodeNameForm<T extends ISimpleCodeNameRecord>(
  props: ISimpleCodeNameFormProps<T>,
) {
  const {
    data,
    onSubmit,
    myRef,
    codePlaceholder = 'Enter code',
    namePlaceholder = 'Enter name',
    codeLabel = 'Code',
    nameLabel = 'Name',
  } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({ code: data?.code ?? '', name: data?.name ?? '' }),
    [data],
  );

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const onFinish = (values: { code: string; name: string }) => {
    const trimmed = trimObject(values);
    onSubmit({
      ...((data ?? {}) as T),
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      status: data?.status,
    } as T);
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
        rules={[
          { required: true, message: `Please enter ${codeLabel.toLowerCase()}` },
          { max: 50, message: `${codeLabel} must be at most 50 characters` },
        ]}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {codeLabel}
          </span>
        }
      >
        <Input
          placeholder={codePlaceholder}
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[
          { required: true, message: `Please enter ${nameLabel.toLowerCase()}` },
          {
            min: 1,
            max: 100,
            message: `${nameLabel} must be 1-100 characters`,
          },
        ]}
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {nameLabel}
          </span>
        }
      >
        <Input
          placeholder={namePlaceholder}
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
}

export default SimpleCodeNameForm;
