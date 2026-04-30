import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import { trimObject } from '@/utils/helperFunction';
import type { IVendorRecord } from '../Vendor.model';
import type { IVendorAddProps } from './Add.model';

const RESIDENT_STATUS_OPTIONS = [
  { value: '', label: 'Resident Status…' },
  { value: 'RESIDENT', label: 'Resident' },
  { value: 'NON_RESIDENT', label: 'Non Resident' },
];

const VENDOR_TYPE_OPTIONS = [
  { value: '', label: 'Vendor Type (MSME)…' },
  { value: 'MSME', label: 'MSME' },
  { value: 'NON_MSME', label: 'Non MSME' },
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'PRIVATE_LTD', label: 'Private Limited' },
  { value: 'PUBLIC_LTD', label: 'Public Limited' },
];

const COUNTRY_CODE_OPTIONS = [
  { value: '', label: 'Select Country Code…' },
  { value: 'IN', label: 'IN — India (+91)' },
  { value: 'US', label: 'US — United States (+1)' },
  { value: 'GB', label: 'GB — United Kingdom (+44)' },
  { value: 'AE', label: 'AE — UAE (+971)' },
  { value: 'SG', label: 'SG — Singapore (+65)' },
  { value: 'AU', label: 'AU — Australia (+61)' },
];

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const SECTION_TITLE =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-600 uppercase mb-4';
const SECTION_DIVIDER = 'border-t border-gray-200 pt-6 mt-2';
const FIELD_INPUT_CLASS = 'rounded-xl soft-input !py-2.5';

const wrapLabel = (l: string) => (
  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
    {l}
  </span>
);

interface FormValues {
  code: string;
  name: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  state_code: string;
  city: string;
  pincode: string;
  country_id: string;
  currency_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_phone: string;
  contact_email: string;
  pan_number: string;
  gst_number: string;
  country_code: string;
  vendor_type: string;
  tds_id: string;
  payment_term_id: string;
  resident_status: string;
  applicant_type_id: string;
  vendor_category_id: string;
  supplier_number: string;
  supplier_name: string;
  status: string;
}

const VendorAdd = (props: IVendorAddProps) => {
  const {
    data,
    onSubmit,
    myRef,
    vendorCategories,
    paymentTerms,
    applicantTypes,
    tdsList,
    countries,
    currencies,
  } = props;
  const [form] = Form.useForm<FormValues>();
  const isEdit = !!data?.id;

  const initialValues = useMemo<FormValues>(
    () => ({
      code: data?.code ?? '',
      name: data?.name ?? '',
      address_line1: data?.address_line1 ?? '',
      address_line2: data?.address_line2 ?? '',
      address_line3: data?.address_line3 ?? '',
      state_code: data?.state_code ?? '',
      city: data?.city ?? '',
      pincode: data?.pincode ?? '',
      country_id: data?.country_id ? String(data.country_id) : '',
      currency_id: data?.currency_id ? String(data.currency_id) : '',
      contact_first_name: data?.contact_first_name ?? '',
      contact_last_name: data?.contact_last_name ?? '',
      contact_phone: data?.contact_phone ?? '',
      contact_email: data?.contact_email ?? '',
      pan_number: data?.pan_number ?? '',
      gst_number: data?.gst_number ?? '',
      country_code: data?.country_code ?? '',
      vendor_type: data?.vendor_type ?? '',
      tds_id: data?.tds_id ? String(data.tds_id) : '',
      payment_term_id: data?.payment_term_id
        ? String(data.payment_term_id)
        : '',
      resident_status: data?.resident_status ?? '',
      applicant_type_id: data?.applicant_type_id
        ? String(data.applicant_type_id)
        : '',
      vendor_category_id: data?.vendor_category_id
        ? String(data.vendor_category_id)
        : '',
      supplier_number: data?.supplier_number ?? '',
      supplier_name: data?.supplier_name ?? '',
      status: data?.status === false ? 'false' : 'true',
    }),
    [data],
  );

  const [local, setLocal] = useState<FormValues>(initialValues);

  useEffect(() => {
    form.resetFields();
    setLocal(initialValues);
  }, [initialValues]);

  const setField = (key: keyof FormValues, val: string) => {
    setLocal((prev) => ({ ...prev, [key]: val }));
    form.setFieldsValue({ [key]: val } as Partial<FormValues>);
  };

  const onFinish = (values: FormValues) => {
    const trimmed = trimObject(values);
    const payload: IVendorRecord = {
      id: data?.id ?? 0,
      code: trimmed.code || undefined,
      name: trimmed.name,
      address_line1: trimmed.address_line1 || undefined,
      address_line2: trimmed.address_line2 || undefined,
      address_line3: trimmed.address_line3 || undefined,
      state_code: trimmed.state_code || undefined,
      city: trimmed.city || undefined,
      pincode: trimmed.pincode || undefined,
      country_id: trimmed.country_id ? Number(trimmed.country_id) : null,
      currency_id: trimmed.currency_id ? Number(trimmed.currency_id) : null,
      contact_first_name: trimmed.contact_first_name || undefined,
      contact_last_name: trimmed.contact_last_name || undefined,
      contact_phone: trimmed.contact_phone || undefined,
      contact_email: trimmed.contact_email || undefined,
      pan_number: trimmed.pan_number
        ? trimmed.pan_number.toUpperCase()
        : undefined,
      gst_number: trimmed.gst_number
        ? trimmed.gst_number.toUpperCase()
        : undefined,
      country_code: trimmed.country_code || undefined,
      vendor_type: trimmed.vendor_type || undefined,
      is_msme:
        (trimmed.vendor_type || '').toUpperCase() === 'MSME'
          ? true
          : data?.is_msme ?? false,
      tds_id: trimmed.tds_id ? Number(trimmed.tds_id) : null,
      payment_term_id: trimmed.payment_term_id
        ? Number(trimmed.payment_term_id)
        : null,
      resident_status: trimmed.resident_status || undefined,
      applicant_type_id: trimmed.applicant_type_id
        ? Number(trimmed.applicant_type_id)
        : null,
      vendor_category_id: trimmed.vendor_category_id
        ? Number(trimmed.vendor_category_id)
        : null,
      supplier_number: trimmed.supplier_number || undefined,
      supplier_name: trimmed.supplier_name || undefined,
      status: trimmed.status !== 'false',
    };
    onSubmit(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item
            name="code"
            label={wrapLabel('Vendor Code (Auto-generated)')}
          >
            <Input
              placeholder="Auto-generated"
              className={FIELD_INPUT_CLASS}
              size="large"
              disabled={!isEdit}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={wrapLabel('Vendor Name')}
            rules={[
              { required: true, message: 'Please enter vendor name' },
              { max: 150, message: 'Max 150 characters' },
            ]}
          >
            <Input
              placeholder="Enter Vendor Name…"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Address Details</p>
        <div className="grid grid-cols-1 gap-x-6">
          <Form.Item name="address_line1" className="!mb-3">
            <Input
              placeholder="Address Line 1"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="address_line2" className="!mb-3">
            <Input
              placeholder="Address Line 2"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="address_line3" className="!mb-3">
            <Input
              placeholder="Address Line 3"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 mt-1">
          <Form.Item name="state_code">
            <Input
              placeholder="State code (e.g. MH)"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="city">
            <Input
              placeholder="City (e.g. Mumbai)"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="pincode">
            <Input
              placeholder="Pincode (e.g. 400001)"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item name="country_id">
            <Select
              value={local.country_id ?? ''}
              onChange={(v) => setField('country_id', v)}
              options={[{ value: '', label: 'Select Country…' }, ...countries]}
              placeholder="Select Country…"
            />
          </Form.Item>
          <Form.Item name="currency_id">
            <Select
              value={local.currency_id ?? ''}
              onChange={(v) => setField('currency_id', v)}
              options={[
                { value: '', label: 'Payment Currency…' },
                ...currencies,
              ]}
              placeholder="Payment Currency…"
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Contact &amp; Compliance</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item name="contact_first_name">
            <Input
              placeholder="Contact First Name"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="contact_last_name">
            <Input
              placeholder="Contact Last Name"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="contact_phone">
            <Input
              placeholder="Phone Number"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="contact_email"
            rules={[{ type: 'email', message: 'Invalid email address' }]}
          >
            <Input
              placeholder="Email ID"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="pan_number">
            <Input
              placeholder="PAN Number"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item name="gst_number">
            <Input
              placeholder="GST Number"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="country_code"
          label={wrapLabel('Taxpayer Country Code (for Oracle Fusion)')}
        >
          <Select
            value={local.country_code ?? ''}
            onChange={(v) => setField('country_code', v)}
            options={COUNTRY_CODE_OPTIONS}
            placeholder="Select Country Code…"
          />
        </Form.Item>

        <Form.Item name="vendor_type" label={wrapLabel('Vendor Type (MSME)')}>
          <Select
            value={local.vendor_type ?? ''}
            onChange={(v) => setField('vendor_type', v)}
            options={VENDOR_TYPE_OPTIONS}
            placeholder="Vendor Type (MSME)…"
          />
        </Form.Item>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Tax, Entity &amp; Category</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item name="tds_id">
            <Select
              value={local.tds_id ?? ''}
              onChange={(v) => setField('tds_id', v)}
              options={[{ value: '', label: 'Select TDS Section…' }, ...tdsList]}
              placeholder="Select TDS Section…"
            />
          </Form.Item>
          <Form.Item name="payment_term_id">
            <Select
              value={local.payment_term_id ?? ''}
              onChange={(v) => setField('payment_term_id', v)}
              options={[
                { value: '', label: 'Select Payment Terms…' },
                ...paymentTerms,
              ]}
              placeholder="Select Payment Terms…"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
          <Form.Item name="resident_status">
            <Select
              value={local.resident_status ?? ''}
              onChange={(v) => setField('resident_status', v)}
              options={RESIDENT_STATUS_OPTIONS}
              placeholder="Resident Status…"
            />
          </Form.Item>
          <Form.Item name="applicant_type_id">
            <Select
              value={local.applicant_type_id ?? ''}
              onChange={(v) => setField('applicant_type_id', v)}
              options={[
                { value: '', label: 'Applicant Type…' },
                ...applicantTypes,
              ]}
              placeholder="Applicant Type…"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="vendor_category_id"
          rules={[{ required: true, message: 'Please select vendor category' }]}
        >
          <Select
            value={local.vendor_category_id ?? ''}
            onChange={(v) => setField('vendor_category_id', v)}
            options={[
              { value: '', label: 'Vendor Category…' },
              ...vendorCategories,
            ]}
            placeholder="Vendor Category…"
          />
        </Form.Item>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Oracle Fusion (Supplier)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Form.Item
            name="supplier_number"
            label={wrapLabel('Supplier Number (Oracle)')}
          >
            <Input
              placeholder="Fusion supplier number"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="supplier_name"
            label={wrapLabel('Supplier Name (Oracle)')}
          >
            <Input
              placeholder="As registered in Fusion"
              className={FIELD_INPUT_CLASS}
              size="large"
            />
          </Form.Item>
        </div>
      </div>

      <div className={SECTION_DIVIDER}>
        <p className={SECTION_TITLE}>Governance &amp; Status</p>
        <Form.Item name="status" label={wrapLabel('Operational Status')}>
          <Select
            value={local.status ?? 'true'}
            onChange={(v) => setField('status', v)}
            options={STATUS_OPTIONS}
            placeholder="Active"
          />
        </Form.Item>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default VendorAdd;
