import { useEffect, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { Select } from '@/components/ui/Select';
import stateService from '@/services/state/state.service';
import type { IStateDetails } from '@/services/state/state.model';
import { trimObject } from '@/utils/helperFunction';
import type { ICityRecord } from '../City.model';
import type { ICityAddProps } from './Add.model';

const rules = {
  name: [
    { required: true, message: 'Please enter city name' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters' },
  ],
  country_id: [{ required: true, message: 'Please select a country' }],
  state_id: [{ required: true, message: 'Please select a state' }],
};

const fetchStatesByCountry = async (
  countryId: string | number | undefined,
): Promise<IStateDetails[]> => {
  if (!countryId) return [];
  const params = new URLSearchParams();
  params.set('noLimit', 'true');
  params.set('status', 'true');
  params.set('country_id', String(countryId));
  try {
    const res = await stateService.searchStateData(params);
    const rows =
      (res.data as unknown as { rows?: IStateDetails[] })?.rows ??
      (res.data?.rows as IStateDetails[]) ??
      [];
    return rows ?? [];
  } catch {
    return [];
  }
};

const CityAdd = (props: ICityAddProps) => {
  const { data, onSubmit, myRef, countries } = props;
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      name: data?.name ?? '',
      country_id: data?.country_id ? String(data.country_id) : undefined,
      state_id: data?.state_id ? String(data.state_id) : undefined,
    }),
    [data],
  );

  const [states, setStates] = useState<IStateDetails[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialValues.country_id ?? '',
  );
  const [selectedState, setSelectedState] = useState<string>(
    initialValues.state_id ?? '',
  );

  useEffect(() => {
    form.resetFields();
    setSelectedCountry(initialValues.country_id ?? '');
    setSelectedState(initialValues.state_id ?? '');
  }, [initialValues]);

  useEffect(() => {
    fetchStatesByCountry(selectedCountry).then(setStates);
  }, [selectedCountry]);

  const stateOptions = useMemo(
    () => states.map((s) => ({ value: String(s.id), label: s.name ?? '' })),
    [states],
  );

  const onFinish = (values: {
    name: string;
    country_id: string;
    state_id: string;
  }) => {
    const trimmed = trimObject(values);
    const payload: ICityRecord = {
      id: data?.id ?? 0,
      name: trimmed.name,
      country_id: Number(trimmed.country_id),
      state_id: Number(trimmed.state_id),
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
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Country
          </span>
        }
        rules={rules.country_id}
      >
        <Select
          value={selectedCountry}
          onChange={(v) => {
            setSelectedCountry(v);
            setSelectedState('');
            form.setFieldsValue({ country_id: v, state_id: undefined });
          }}
          options={countries}
          placeholder="Select country"
        />
      </Form.Item>

      <Form.Item
        name="state_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            State
          </span>
        }
        rules={rules.state_id}
      >
        <Select
          value={selectedState}
          onChange={(v) => {
            setSelectedState(v);
            form.setFieldsValue({ state_id: v });
          }}
          options={stateOptions}
          placeholder={selectedCountry ? 'Select state' : 'Select country first'}
          disabled={!selectedCountry}
        />
      </Form.Item>

      <div className="md:col-span-2">
        <Form.Item
          name="name"
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </span>
          }
          rules={rules.name}
        >
          <Input
            placeholder="e.g. Mumbai"
            className="rounded-xl soft-input !py-2"
            size="large"
          />
        </Form.Item>
      </div>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default CityAdd;
