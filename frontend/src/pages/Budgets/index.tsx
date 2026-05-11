import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import { Filter, Loader2, Plus, Wallet } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { Select } from '@/components/ui/Select';
import {
  SoftDataTable,
  type ISoftColumn,
} from '@/components/SoftDataTable';
import { Can } from '@/ability/can';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import {
  createNewBudget,
  searchBudgetData,
} from '@/state/budget/budget.action';
import {
  budgetMasterSelector,
  clearBudgetMessage,
} from '@/state/budget/budget.reducer';
import type { IBudgetRow } from '@/services/budget/budget.model';
import departmentService from '@/services/department/department.service';
import entityService from '@/services/entity/entity.service';
import itemTypeService from '@/services/itemType/itemType.service';
import { Common } from '@/utils/constants/constant';
import { trimObject } from '@/utils/helperFunction';
import {
  BUDGET_CONTROL_LABEL,
  DEFAULT_PAGE_SIZE,
  RESERVED_QUERY_KEYS,
} from '@/common/constants';
import {
  formatShortDate,
  getIndianFinancialYearOptions,
} from '@/common/utils';
import BudgetAdd from './Add';
import type { IBudgetRecord } from './Budget.model';

/** Compact rupee format used by the budget table cells:
 *  whole-number, comma-grouped (₹100,000 / ₹-100,780) — matches the design spec.
 *  Note: minus sign is placed *after* the ₹ symbol (e.g. `₹-100,780`).
 */
const formatRupee = (value: unknown): string => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return '₹0';
  const rounded = Math.round(num);
  if (rounded < 0) {
    return `₹-${Math.abs(rounded).toLocaleString('en-US')}`;
  }
  return `₹${rounded.toLocaleString('en-US')}`;
};

interface IBudgetFilterValues {
  search?: string;
  financial_year?: string;
  budget_type?: string;
  department_id?: string;
  entity_id?: string;
}

export const BudgetsPage = () => {
  const dispatch = useAppDispatch();
  const budgetState = useAppSelector(budgetMasterSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterForm] = Form.useForm();

  const take = Number(searchParams.get('take')) || DEFAULT_PAGE_SIZE;
  const skip = Number(searchParams.get('skip')) || 0;

  const [count, setCount] = useState(0);
  const [formValues, setFormValues] = useState<IBudgetFilterValues>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

  const [deptFilterOptions, setDeptFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [entityFilterOptions, setEntityFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [budgetTypeFilterOptions, setBudgetTypeFilterOptions] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: 'All types' }]);
  const mastersFetchedRef = useRef(false);

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const fyFilterOptions = useMemo(
    () => getIndianFinancialYearOptions({ includeAll: true }),
    [],
  );

  /** Maps URL search params to API GET params (numeric FKs). */
  const dataConvertFromSearchParm = (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      if (key === 'department_id' || key === 'entity_id') {
        data[key] = value ? Number(value) : undefined;
      } else {
        data[key] = value;
      }
    });
    if (!data.take) data.take = DEFAULT_PAGE_SIZE;
    if (data.skip === undefined || data.skip === '') data.skip = 0;
    return data;
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (!sp.has('take') || !sp.has('skip')) {
      if (!sp.has('take')) sp.set('take', String(DEFAULT_PAGE_SIZE));
      if (!sp.has('skip')) sp.set('skip', '0');
      setSearchParams(sp, { replace: true });
      return;
    }
    dispatch(searchBudgetData(dataConvertFromSearchParm()));
  }, [searchParams]);

  useEffect(() => {
    const data: IBudgetFilterValues = {};
    searchParams.forEach((value, key) => {
      if (RESERVED_QUERY_KEYS.has(key)) return;
      (data as Record<string, string>)[key] = value;
    });
    setFormValues(data);
  }, [searchParams]);

  useEffect(() => {
    filterForm.resetFields();
  }, [formValues]);

  useEffect(() => {
    let sum = 0;
    searchParams.forEach((value, key) => {
      if (RESERVED_QUERY_KEYS.has(key)) return;
      if (value !== '' && value !== undefined) sum += 1;
    });
    setCount(sum);
  }, [searchParams]);

  useEffect(() => {
    if (mastersFetchedRef.current) return;
    mastersFetchedRef.current = true;
    const itParams = new URLSearchParams();
    itParams.set('noLimit', 'true');
    itParams.set('status', 'true');
    Promise.all([
      departmentService.searchDepartmentData({
        take: 500,
        skip: 0,
        status: true,
      }),
      entityService.searchEntityData({ take: 500, skip: 0, status: true }),
      itemTypeService.search(itParams),
    ])
      .then(([dRes, eRes, itRes]) => {
        const dRows = dRes?.data?.rows ?? [];
        setDeptFilterOptions([
          { value: '', label: 'All departments' },
          ...dRows.map((r) => ({
            value: String(r.id),
            label: r.name ?? '',
          })),
        ]);
        const eRows = eRes?.data?.rows ?? [];
        setEntityFilterOptions([
          { value: '', label: 'All entities' },
          ...eRows.map((r) => ({
            value: String(r.id),
            label: r.name ?? '',
          })),
        ]);
        const itRows = itRes?.data?.rows ?? [];
        setBudgetTypeFilterOptions([
          { value: '', label: 'All types' },
          ...itRows.map((r) => ({
            value: r.code,
            label: r.name,
          })),
        ]);
      })
      .catch(() => {
        setDeptFilterOptions([{ value: '', label: 'All departments' }]);
        setEntityFilterOptions([{ value: '', label: 'All entities' }]);
        setBudgetTypeFilterOptions([{ value: '', label: 'All types' }]);
      });
  }, []);

  useEffect(() => {
    if (budgetState.createBudget.message) {
      if (budgetState.createBudget.hasErrors)
        message.error(budgetState.createBudget.message);
      else message.success(budgetState.createBudget.message);
      dispatch(clearBudgetMessage());
    }
  }, [budgetState.createBudget.message]);

  useEffect(() => {
    if (budgetState.budgetsData.message && budgetState.budgetsData.hasErrors) {
      message.error(budgetState.budgetsData.message);
      dispatch(clearBudgetMessage());
    }
  }, [budgetState.budgetsData.message, budgetState.budgetsData.hasErrors]);

  const rows = budgetState.budgetsData.data?.rows ?? [];
  const meta = budgetState.budgetsData.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = budgetState.budgetsData.loading;

  const isSubmitting = budgetState.createBudget.loading;

  const refreshCurrent = () => {
    dispatch(searchBudgetData(dataConvertFromSearchParm()));
  };

  /** Merge filter form into existing URL params, reset to page 1. */
  const onFinish = (values: IBudgetFilterValues) => {
    const existing: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      existing[key] = value;
    });
    const merged: Record<string, unknown> = { ...existing, ...values };

    const queryString = Object.entries(trimObject(merged))
      .filter(
        ([key, val]) =>
          val !== undefined &&
          val !== '' &&
          !(Array.isArray(val) && val.length === 0) &&
          key !== 'skip',
      )
      .map(([key, val]) => `${key}=${encodeURIComponent(String(val))}`)
      .join('&');

    const newParams = new URLSearchParams(queryString);
    if (!newParams.has('take')) newParams.set('take', String(take));
    newParams.set('skip', '0');

    setSearchParams(newParams);
    setIsFilterDrawerOpen(false);
  };

  const onReset = () => {
    const sp = new URLSearchParams();
    sp.set('take', String(take));
    sp.set('skip', '0');
    setSearchParams(sp);
    filterForm.resetFields();
    setIsFilterDrawerOpen(false);
  };

  const openCreateDrawer = () => {
    setIsFormDrawerOpen(true);
  };

  const handleFormSubmit = async (values: IBudgetRecord) => {
    const result = await dispatch(
      createNewBudget(
        trimObject({
          financial_year: values.financial_year,
          budget_type: values.budget_type,
          coa_id: values.coa_id,
          department_id: values.department_id,
          subdepartment_id: values.subdepartment_id,
          entity_id: values.entity_id,
          center_id: values.center_id,
          cost_center_id: values.cost_center_id,
          amount: values.amount,
          control_type: values.control_type,
        }),
      ),
    );
    if (createNewBudget.fulfilled.match(result)) {
      setIsFormDrawerOpen(false);
      if (skip === 0) {
        refreshCurrent();
      } else {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set('skip', '0');
        setSearchParams(sp);
      }
    }
  };

  const columns: ISoftColumn<IBudgetRow>[] = [
    {
      key: 'gl_code',
      title: 'GL Code',
      skeletonWidth: 'w-20',
      render: (row) => (
        <span className="font-bold text-gray-900">
          {row.coa?.gl_code ?? '—'}
        </span>
      ),
    },
    {
      key: 'budget_type',
      title: 'Type',
      sortable: 'budget_type',
      skeletonWidth: 'w-16',
      render: (row) => {
        const type = String(row.budget_type ?? '').toUpperCase();
        const styles: Record<string, string> = {
          CAPEX: 'bg-purple-100 text-purple-700',
          OPEX: 'bg-blue-100 text-blue-700',
        };
        const cls = styles[type] ?? 'bg-gray-100 text-gray-700';
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}
          >
            {type || '—'}
          </span>
        );
      },
    },
    {
      key: 'entity_location',
      title: 'Entity/Location',
      skeletonWidth: 'w-40',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {row.entity?.name ?? '—'}
          </span>
          {row.center?.name && (
            <span className="text-xs text-gray-500 mt-0.5">
              {row.center.name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      skeletonWidth: 'w-28',
      render: (row) => (
        <span className="text-gray-800">{row.department?.name ?? '—'}</span>
      ),
    },
    {
      key: 'subdepartment',
      title: 'Subdepartment',
      skeletonWidth: 'w-28',
      render: (row) => (
        <span className="text-gray-800">{row.subdepartment?.name ?? '—'}</span>
      ),
    },
    {
      key: 'amount',
      title: 'Total Budget',
      sortable: 'amount',
      align: 'left',
      cellClassName: 'tabular-nums align-middle',
      skeletonWidth: 'w-28',
      render: (row) => (
        <span className="text-[15px] font-bold text-gray-900 whitespace-nowrap">
          {formatRupee(row.amount)}
        </span>
      ),
    },
    {
      key: 'consumed_amount',
      title: 'Consumed',
      sortable: 'consumed_amount',
      align: 'left',
      cellClassName: 'tabular-nums align-middle',
      skeletonWidth: 'w-40',
      render: (row) => {
        const amount = Number(row.amount ?? 0);
        const consumed = Number(row.consumed_amount ?? 0);
        const ratio = amount > 0 ? consumed / amount : 0;
        const overspent = ratio > 1;
        const fillPct = Math.min(Math.max(ratio, 0), 1) * 100;
        return (
          <div className="flex flex-col gap-1.5 min-w-[150px] max-w-[200px]">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {formatRupee(consumed)}
            </span>
            <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  overspent ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${overspent ? 100 : fillPct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'balance_amount',
      title: 'Balance',
      sortable: 'balance_amount',
      align: 'left',
      cellClassName: 'tabular-nums align-middle',
      skeletonWidth: 'w-28',
      render: (row) => {
        const amount = Number(row.amount ?? 0);
        const consumed = Number(row.consumed_amount ?? 0);
        const balance =
          row.balance_amount !== undefined && row.balance_amount !== null
            ? Number(row.balance_amount)
            : amount - consumed;
        const negative = balance < 0;
        return (
          <span
            className={`text-[15px] font-bold whitespace-nowrap ${
              negative ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {formatRupee(balance)}
          </span>
        );
      },
    },
    {
      key: 'created_date',
      title: 'Created',
      sortable: 'created_date',
      cellClassName: 'text-gray-600',
      skeletonWidth: 'w-24',
      render: (row) => formatShortDate(row.created_date),
    },
    {
      key: 'control_type',
      title: 'Control',
      skeletonWidth: 'w-20',
      render: (row) =>
        BUDGET_CONTROL_LABEL[String(row.control_type)] ?? row.control_type,
    },
  ];

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Wallet size={18} className="text-emerald-600" />
              Budgets
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} budget{totalCount === 1 ? '' : 's'} configured
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
            >
              Filter <Filter size={14} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <Can I={Common.Actions.CAN_ADD} a={Common.Modules.FINANCE.BUDGETS}>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New Budget
              </button>
            </Can>
          </div>
        </div>

        <SoftDataTable<IBudgetRow>
          columns={columns}
          data={rows}
          loading={isLoading}
          meta={meta}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          emptyTitle="No budgets found."
          emptyDescription="Try adjusting filters or create a new budget."
          emptyIcon={<Wallet size={28} className="text-gray-300" />}
        />
      </div>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Budgets"
        subtitle="Search and narrow the budget list"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => filterForm.submit()}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <Form
          form={filterForm}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formValues}
          className="space-y-3"
        >
          <Form.Item
            name="search"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Search (COA)
              </span>
            }
          >
            <Input
              placeholder="GL code or name"
              className="rounded-xl soft-input !py-2"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="financial_year"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Financial Year
              </span>
            }
          >
            <Select
              value={formValues.financial_year ?? ''}
              onChange={(v) => {
                filterForm.setFieldsValue({ financial_year: v });
                setFormValues((prev) => ({ ...prev, financial_year: v }));
              }}
              options={fyFilterOptions}
              placeholder="All years"
            />
          </Form.Item>

          <Form.Item
            name="budget_type"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Budget Type
              </span>
            }
          >
            <Select
              value={formValues.budget_type ?? ''}
              onChange={(v) => {
                filterForm.setFieldsValue({ budget_type: v });
                setFormValues((prev) => ({ ...prev, budget_type: v }));
              }}
              options={budgetTypeFilterOptions}
              placeholder="All types"
            />
          </Form.Item>

          <Form.Item
            name="department_id"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Department
              </span>
            }
          >
            <Select
              value={formValues.department_id ?? ''}
              onChange={(v) => {
                filterForm.setFieldsValue({ department_id: v });
                setFormValues((prev) => ({ ...prev, department_id: v }));
              }}
              options={deptFilterOptions}
              placeholder="All departments"
            />
          </Form.Item>

          <Form.Item
            name="entity_id"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Entity
              </span>
            }
          >
            <Select
              value={formValues.entity_id ?? ''}
              onChange={(v) => {
                filterForm.setFieldsValue({ entity_id: v });
                setFormValues((prev) => ({ ...prev, entity_id: v }));
              }}
              options={entityFilterOptions}
              placeholder="All entities"
            />
          </Form.Item>
        </Form>
      </Drawer>

      <FormModal
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        title="Create New Budget"
        subtitle="Allocate budget by FY, COA, organization, and location."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormDrawerOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => submitBtnRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Create Budget
            </button>
          </div>
        }
        size="xl"
      >
        <BudgetAdd
          key="create"
          onSubmit={handleFormSubmit}
          myRef={submitBtnRef}
        />
      </FormModal>
    </div>
  );
};

export default BudgetsPage;
