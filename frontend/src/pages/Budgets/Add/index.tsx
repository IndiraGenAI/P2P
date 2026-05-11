import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ClipboardEvent,
} from 'react';
import { Form, InputNumber, Select } from 'antd';
import coaService from '@/services/coa/coa.service';
import departmentService from '@/services/department/department.service';
import subdepartmentService from '@/services/subdepartment/subdepartment.service';
import entityService from '@/services/entity/entity.service';
import centerService from '@/services/center/center.service';
import costCenterService from '@/services/cost-center/cost-center.service';
import type {
  BudgetControlType,
  BudgetType,
} from '@/services/budget/budget.model';
import itemTypeService from '@/services/itemType/itemType.service';
import { trimObject } from '@/utils/helperFunction';
import {
  allowAmountKeyDown,
  getIndianFinancialYearOptions,
  sanitizeAmountString,
} from '@/common/utils';
import type { IBudgetRecord } from '../Budget.model';
import type { IBudgetAddProps } from './Add.model';
import { BUDGET_CONTROL_OPTIONS } from '@/common/constants';

type AntOption = { value: number; label: string };
type ItemTypeBudgetOption = { value: string; label: string };

const rules = {
  financial_year: [{ required: true, message: 'Select financial year' }],
  budget_type: [{ required: true, message: 'Select budget type' }],
  coa_id: [{ required: true, message: 'Select COA' }],
  department_id: [{ required: true, message: 'Select department' }],
  subdepartment_id: [{ required: true, message: 'Select subdepartment' }],
  entity_id: [{ required: true, message: 'Select entity' }],
  center_id: [{ required: true, message: 'Select location' }],
  cost_center_id: [{ required: true, message: 'Select cost center' }],
  amount: [
    { required: true, message: 'Enter budget amount' },
    {
      validator: (_: unknown, value: unknown) => {
        if (value === undefined || value === null) {
          return Promise.resolve();
        }
        const n = Number(value);
        if (Number.isNaN(n) || n < 0) {
          return Promise.reject(new Error('Enter a valid amount'));
        }
        return Promise.resolve();
      },
    },
  ],
  control_type: [{ required: true, message: 'Select control type' }],
};

const BudgetAdd = (props: IBudgetAddProps) => {
  const { data, onSubmit, myRef } = props;
  const [form] = Form.useForm();

  const fyOptions = useMemo(() => getIndianFinancialYearOptions(), []);

  const [coaOptions, setCoaOptions] = useState<AntOption[]>([]);
  const [deptOptions, setDeptOptions] = useState<AntOption[]>([]);
  const [subdeptOptions, setSubdeptOptions] = useState<AntOption[]>([]);
  const [entityOptions, setEntityOptions] = useState<AntOption[]>([]);
  const [centerOptions, setCenterOptions] = useState<AntOption[]>([]);
  const [costCenterOpts, setCostCenterOpts] = useState<AntOption[]>([]);
  const [budgetTypeOptions, setBudgetTypeOptions] = useState<
    ItemTypeBudgetOption[]
  >([]);

  const selectedDeptId = Form.useWatch('department_id', form);

  const loadMasters = useCallback(async () => {
    const itemTypeParams = new URLSearchParams();
    itemTypeParams.set('noLimit', 'true');
    itemTypeParams.set('status', 'true');
    try {
      const [coaRes, deptRes, entRes, cenRes, ccRes, itemTypeRes] =
        await Promise.all([
          coaService.searchCoaData({
            take: 500,
            skip: 0,
            status: true,
            orderBy: 'gl_code',
            order: 'ASC',
          }),
          departmentService.searchDepartmentData({
            take: 500,
            skip: 0,
            status: true,
          }),
          entityService.searchEntityData({ take: 500, skip: 0, status: true }),
          centerService.searchCenterData({ take: 500, skip: 0, status: true }),
          costCenterService.searchCostCenterData({
            take: 500,
            skip: 0,
            status: true,
          }),
          itemTypeService.search(itemTypeParams),
        ]);

      const coaRows = coaRes?.data?.rows ?? [];
      setCoaOptions(
        coaRows.map((r) => ({
          value: r.id,
          label: `${r.gl_code} — ${r.gl_name}`,
        })),
      );
      setDeptOptions(
        (deptRes?.data?.rows ?? []).map((r) => ({
          value: r.id,
          label: r.name,
        })),
      );
      setEntityOptions(
        (entRes?.data?.rows ?? []).map((r) => ({
          value: r.id,
          label: r.name,
        })),
      );
      setCenterOptions(
        (cenRes?.data?.rows ?? []).map((r) => ({
          value: r.id,
          label: `${r.code} — ${r.name}`,
        })),
      );
      setCostCenterOpts(
        (ccRes?.data?.rows ?? []).map((r) => ({
          value: r.id,
          label: `${r.code} — ${r.name}`,
        })),
      );
      const typeRows = itemTypeRes?.data?.rows ?? [];
      const btOpts = typeRows.map((r) => ({
        value: r.code,
        label: r.name,
      }));
      setBudgetTypeOptions(btOpts);
      if (data == null && btOpts.length > 0) {
        const current = form.getFieldValue('budget_type') as string | undefined;
        if (current == null || current === '') {
          form.setFieldsValue({ budget_type: btOpts[0].value });
        }
      }
    } catch {
      setCoaOptions([]);
      setBudgetTypeOptions([]);
    }
  }, [data, form]);

  const loadSubdepartments = useCallback(async (departmentId: number) => {
    if (!departmentId) {
      setSubdeptOptions([]);
      return;
    }
    try {
      const res = await subdepartmentService.searchSubdepartmentData({
        take: 500,
        skip: 0,
        department_id: departmentId,
        status: true,
      });
      setSubdeptOptions(
        (res?.data?.rows ?? []).map((r) => ({
          value: r.id,
          label: r.name,
        })),
      );
    } catch {
      setSubdeptOptions([]);
    }
  }, []);

  useEffect(() => {
    void loadMasters();
  }, [loadMasters]);

  useEffect(() => {
    if (selectedDeptId == null) return;
    void loadSubdepartments(Number(selectedDeptId));
  }, [selectedDeptId, loadSubdepartments]);

  const initialValues = useMemo(() => {
    const defaultFy =
      fyOptions.find((o) =>
        o.value.includes(String(new Date().getFullYear())),
      )?.value ?? fyOptions[3]?.value;
    if (!data) {
      return {
        financial_year: defaultFy,
        control_type: 'HARD_STOP' as BudgetControlType,
        amount: 0,
      };
    }
    return {
      financial_year: data.financial_year,
      budget_type: data.budget_type,
      coa_id: data.coa_id,
      department_id: data.department_id,
      subdepartment_id: data.subdepartment_id,
      entity_id: data.entity_id,
      center_id: data.center_id,
      cost_center_id: data.cost_center_id,
      amount: Number(data.amount ?? 0),
      control_type: data.control_type,
    };
  }, [data, fyOptions]);

  useEffect(() => {
    if (data?.department_id) {
      void loadSubdepartments(data.department_id);
    }
  }, [data?.id, data?.department_id, loadSubdepartments]);

  const handleAmountPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const raw = e.clipboardData.getData('text/plain');
      const sanitized = sanitizeAmountString(raw);
      if (sanitized === '' || sanitized === '.') {
        return;
      }
      const n = Number.parseFloat(sanitized);
      if (Number.isNaN(n) || n < 0) {
        return;
      }
      const rounded = Math.round(n * 100) / 100;
      form.setFieldsValue({ amount: rounded });
    },
    [form],
  );

  const onFinish = (values: Record<string, unknown>) => {
    const trimmed = trimObject(values) as Record<string, string | number>;
    const payload: IBudgetRecord = {
      id: data?.id ?? 0,
      financial_year: String(trimmed.financial_year),
      budget_type: trimmed.budget_type as BudgetType,
      coa_id: Number(trimmed.coa_id),
      department_id: Number(trimmed.department_id),
      subdepartment_id: Number(trimmed.subdepartment_id),
      entity_id: Number(trimmed.entity_id),
      center_id: Number(trimmed.center_id),
      cost_center_id: Number(trimmed.cost_center_id),
      amount: Number(trimmed.amount),
      control_type: trimmed.control_type as BudgetControlType,
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
        name="financial_year"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Financial Year
          </span>
        }
        rules={rules.financial_year}
      >
        <Select
          options={fyOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select FY"
          size="large"
          className="rounded-xl"
        />
      </Form.Item>

      <Form.Item
        name="budget_type"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Budget Type
          </span>
        }
        rules={rules.budget_type}
      >
        <Select
          options={budgetTypeOptions}
          placeholder="Select item type"
          size="large"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        name="coa_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            GL Code (COA)
          </span>
        }
        rules={rules.coa_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={coaOptions}
          placeholder="Select COA"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="department_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Department
          </span>
        }
        rules={rules.department_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={deptOptions}
          placeholder="Department"
          size="large"
          onChange={() =>
            form.setFieldsValue({ subdepartment_id: undefined })
          }
        />
      </Form.Item>

      <Form.Item
        name="subdepartment_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Subdepartment
          </span>
        }
        rules={rules.subdepartment_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={subdeptOptions}
          placeholder={
            selectedDeptId ? 'Subdepartment' : 'Select department first'
          }
          disabled={!selectedDeptId}
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="entity_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Entity
          </span>
        }
        rules={rules.entity_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={entityOptions}
          placeholder="Entity"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="center_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Location
          </span>
        }
        rules={rules.center_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={centerOptions}
          placeholder="Center / location"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="cost_center_id"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Cost Center
          </span>
        }
        rules={rules.cost_center_id}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={costCenterOpts}
          placeholder="Cost center"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="amount"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Budget Amount
          </span>
        }
        rules={rules.amount}
      >
        <InputNumber
          controls={false}
          min={0}
          precision={2}
          step={0.01}
          placeholder="0.00"
          size="large"
          variant="outlined"
          inputMode="decimal"
          onKeyDown={allowAmountKeyDown}
          onPaste={handleAmountPaste}
          className="!w-full rounded-xl soft-input tabular-nums [&_.ant-input-number-input]:py-0 [&_.ant-input-number-input]:h-10 [&_.ant-input-number-input]:leading-10"
        />
      </Form.Item>

      <Form.Item
        name="control_type"
        label={
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Control Type
          </span>
        }
        rules={rules.control_type}
      >
        <Select
          options={BUDGET_CONTROL_OPTIONS}
          placeholder="Control"
          size="large"
        />
      </Form.Item>

      <button ref={myRef} type="submit" className="hidden" tabIndex={-1}>
        Submit
      </button>
    </Form>
  );
};

export default BudgetAdd;
