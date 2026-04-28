import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { IItemRecord } from '../Item.model';
import type { IItemAddProps } from './Add.model';

const rules = {
  code: [
    { required: true, message: 'Please enter item code' },
    { max: 50, message: 'Code must be at most 50 characters' },
  ],
  name: [
    { required: true, message: 'Please enter item name' },
    { min: 1, max: 150, message: 'Name must be 1-150 characters' },
  ],
  item_type_id: [{ required: true, message: 'Please select item type' }],
  item_category_id: [
    { required: true, message: 'Please select item category' },
  ],
  uom_id: [{ required: true, message: 'Please select UOM' }],
};

const ItemAdd = (props: IItemAddProps) => {
  const {
    data,
    onSubmit,
    myRef,
    itemTypes,
    itemCategories,
    uoms,
    coas,
  } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      item_type_id: data?.item_type_id ? String(data.item_type_id) : undefined,
      item_category_id: data?.item_category_id
        ? String(data.item_category_id)
        : undefined,
      uom_id: data?.uom_id ? String(data.uom_id) : undefined,
      coa_id: data?.coa_id ? String(data.coa_id) : undefined,
    }),
    [data],
  );

  const [itemType, setItemType] = useState<string>(
    initialValues.item_type_id ?? '',
  );
  const [itemCategory, setItemCategory] = useState<string>(
    initialValues.item_category_id ?? '',
  );
  const [uom, setUom] = useState<string>(initialValues.uom_id ?? '');
  const [coa, setCoa] = useState<string>(initialValues.coa_id ?? '');

  useEffect(() => {
    form.resetFields();
    setItemType(initialValues.item_type_id ?? '');
    setItemCategory(initialValues.item_category_id ?? '');
    setUom(initialValues.uom_id ?? '');
    setCoa(initialValues.coa_id ?? '');
  }, [initialValues]);

  const onFinish = (values: {
    code: string;
    name: string;
    item_type_id: string;
    item_category_id: string;
    uom_id: string;
    coa_id?: string;
  }) => {
    const trimmed = trimObject(values);
    const payload: IItemRecord = {
      id: data?.id ?? 0,
      code: trimmed.code,
      name: trimmed.name,
      item_type_id: trimmed.item_type_id ? Number(trimmed.item_type_id) : null,
      item_category_id: trimmed.item_category_id
        ? Number(trimmed.item_category_id)
        : null,
      uom_id: trimmed.uom_id ? Number(trimmed.uom_id) : null,
      coa_id: trimmed.coa_id ? Number(trimmed.coa_id) : null,
      status: data?.status,
    };
    onSubmit(payload);
  };

  const wrapLabel = (label: string) => (
    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
      {label}
    </span>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-5"
    >
      <Form.Item name="code" rules={rules.code} label={wrapLabel('Code')}>
        <Input
          placeholder="e.g. ITEM-001"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item name="name" rules={rules.name} label={wrapLabel('Name')}>
        <Input
          placeholder="e.g. Office Chair"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="item_type_id"
        rules={rules.item_type_id}
        label={wrapLabel('Item Type')}
      >
        <Select
          value={itemType}
          onChange={(v) => {
            setItemType(v);
            form.setFieldsValue({ item_type_id: v });
          }}
          options={itemTypes}
          placeholder="Select item type"
        />
      </Form.Item>

      <Form.Item
        name="item_category_id"
        rules={rules.item_category_id}
        label={wrapLabel('Item Category')}
      >
        <Select
          value={itemCategory}
          onChange={(v) => {
            setItemCategory(v);
            form.setFieldsValue({ item_category_id: v });
          }}
          options={itemCategories}
          placeholder="Select item category"
        />
      </Form.Item>

      <Form.Item name="uom_id" rules={rules.uom_id} label={wrapLabel('UOM')}>
        <Select
          value={uom}
          onChange={(v) => {
            setUom(v);
            form.setFieldsValue({ uom_id: v });
          }}
          options={uoms}
          placeholder="Select UOM"
        />
      </Form.Item>

      <Form.Item name="coa_id" label={wrapLabel('COA')}>
        <Select
          value={coa}
          onChange={(v) => {
            setCoa(v);
            form.setFieldsValue({ coa_id: v });
          }}
          options={[{ value: '', label: '— None —' }, ...coas]}
          placeholder="Select COA (optional)"
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default ItemAdd;
