import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { IVendorSiteRecord } from '../VendorSite.model';
import type { IVendorSiteAddProps } from './Add.model';

const { TextArea } = Input;

const rules = {
  vendor_id: [{ required: true, message: 'Please select vendor' }],
  site_code: [
    { required: true, message: 'Please enter site code' },
    { max: 50, message: 'Site code must be at most 50 characters' },
  ],
  contact_email: [
    { type: 'email' as const, message: 'Please enter a valid email' },
  ],
};

const VendorSiteAdd = (props: IVendorSiteAddProps) => {
  const { data, onSubmit, myRef, vendors } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      vendor_id: data?.vendor_id ? String(data.vendor_id) : undefined,
      site_code: data?.site_code ?? '',
      site_name: data?.site_name ?? '',
      address: data?.address ?? '',
      contact_person: data?.contact_person ?? '',
      contact_phone: data?.contact_phone ?? '',
      contact_email: data?.contact_email ?? '',
      supplier_site_name: data?.supplier_site_name ?? '',
      oracle_address_name: data?.oracle_address_name ?? '',
    }),
    [data],
  );

  const [vendorId, setVendorId] = useState<string>(
    initialValues.vendor_id ?? '',
  );

  useEffect(() => {
    form.resetFields();
    setVendorId(initialValues.vendor_id ?? '');
  }, [initialValues]);

  const onFinish = (values: Record<string, string>) => {
    const trimmed = trimObject(values);
    const payload: IVendorSiteRecord = {
      id: data?.id ?? 0,
      vendor_id: Number(trimmed.vendor_id),
      site_code: trimmed.site_code,
      site_name: trimmed.site_name || undefined,
      address: trimmed.address || undefined,
      contact_person: trimmed.contact_person || undefined,
      contact_phone: trimmed.contact_phone || undefined,
      contact_email: trimmed.contact_email || undefined,
      supplier_site_name: trimmed.supplier_site_name || undefined,
      oracle_address_name: trimmed.oracle_address_name || undefined,
      status: data?.status,
    };
    onSubmit(payload);
  };

  const wrapLabel = (l: string) => (
    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
      {l}
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
      <Form.Item
        name="vendor_id"
        rules={rules.vendor_id}
        label={wrapLabel('Vendor')}
      >
        <Select
          value={vendorId}
          onChange={(v) => {
            setVendorId(v);
            form.setFieldsValue({ vendor_id: v });
          }}
          options={vendors}
          placeholder="Select vendor"
        />
      </Form.Item>

      <Form.Item
        name="site_code"
        rules={rules.site_code}
        label={wrapLabel('Site Code')}
      >
        <Input
          placeholder="e.g. SITE-001"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item name="site_name" label={wrapLabel('Site Name')}>
        <Input
          placeholder="Site name"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item name="contact_person" label={wrapLabel('Contact Person')}>
        <Input
          placeholder="Contact person name"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item name="contact_phone" label={wrapLabel('Contact Phone')}>
        <Input
          placeholder="Phone number"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="contact_email"
        rules={rules.contact_email}
        label={wrapLabel('Contact Email')}
      >
        <Input
          placeholder="email@example.com"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item name="supplier_site_name" label={wrapLabel('Supplier Site Name')}>
        <Input
          placeholder="Optional"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="oracle_address_name"
        label={wrapLabel('Oracle Address Name')}
      >
        <Input
          placeholder="Optional"
          className="rounded-xl soft-input !py-2"
          size="large"
        />
      </Form.Item>

      <div className="md:col-span-2">
        <Form.Item name="address" label={wrapLabel('Address')}>
          <TextArea
            placeholder="Site address"
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

export default VendorSiteAdd;
