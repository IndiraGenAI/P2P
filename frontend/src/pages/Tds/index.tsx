import { Fragment, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import {
  ChevronsUpDown,
  FileText,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import {
  createNewTds,
  editTdsById,
  removeTdsById,
  searchTdsData,
  updateTdsStatus,
} from '@/state/tds/tds.action';
import {
  tdsMasterSelector,
  clearTdsMessage,
} from '@/state/tds/tds.reducer';
import type { ITdsDetails } from '@/services/tds/tds.model';
import { Common } from '@/utils/constants/constant';
import { showTooltip, trimObject } from '@/utils/helperFunction';
import TdsAdd from './Add';
import type { ITdsRecord } from './Tds.model';

type SortKey = 'code' | 'name' | 'percentage' | 'created_date' | 'status';
type SortDir = 'ASC' | 'DESC';

interface ITdsFilterValues {
  name?: string;
  status?: string;
}

const rules = {
  name: [{ min: 1, max: 100, message: 'Must be 1-100 characters' }],
};

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const TABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'created_date', label: 'Created Date' },
  { key: 'status', label: 'Status' },
];

const NON_FILTER_KEYS = new Set(['take', 'skip', 'orderBy', 'order']);
const DEFAULT_TAKE = 10;

const formatDate = (value: unknown): string => {
  if (!value) return '—';
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatPercentage = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return `${n.toFixed(2)}%`;
};

export const TdsPage = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(tdsMasterSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterForm] = Form.useForm();

  const take = Number(searchParams.get('take')) || DEFAULT_TAKE;
  const skip = Number(searchParams.get('skip')) || 0;
  const page = Math.floor(skip / take) + 1;
  const sortKey = (searchParams.get('orderBy') ?? '') as SortKey | '';
  const sortDir = ((searchParams.get('order') ?? 'ASC').toUpperCase() === 'DESC'
    ? 'DESC'
    : 'ASC') as SortDir;

  const [count, setCount] = useState<number>(0);
  const [formValues, setFormValues] = useState<ITdsFilterValues>({});
  const [quickSearchInput, setQuickSearchInput] = useState(
    searchParams.get('name') ?? '',
  );

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ITdsRecord | undefined>(
    undefined,
  );
  const [confirmDeleteRow, setConfirmDeleteRow] = useState<ITdsDetails | null>(
    null,
  );

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const dataConvertFromSearchParm = (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    if (!data.take) data.take = DEFAULT_TAKE;
    if (!data.skip) data.skip = 0;
    return data;
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (!sp.has('take') || !sp.has('skip')) {
      if (!sp.has('take')) sp.set('take', String(DEFAULT_TAKE));
      if (!sp.has('skip')) sp.set('skip', '0');
      setSearchParams(sp, { replace: true });
      return;
    }
    dispatch(searchTdsData(dataConvertFromSearchParm()));
  }, [searchParams]);

  useEffect(() => {
    const data: ITdsFilterValues = {};
    searchParams.forEach((value, key) => {
      if (NON_FILTER_KEYS.has(key)) return;
      (data as Record<string, string>)[key] = value;
    });
    setFormValues(data);
    setQuickSearchInput(data.name ?? '');
  }, [searchParams]);

  useEffect(() => {
    filterForm.resetFields();
  }, [formValues]);

  useEffect(() => {
    let sum = 0;
    searchParams.forEach((value, key) => {
      if (NON_FILTER_KEYS.has(key)) return;
      if (value !== '' && value !== undefined) sum += 1;
    });
    setCount(sum);
  }, [searchParams]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((searchParams.get('name') ?? '') === quickSearchInput) return;
      const sp = new URLSearchParams(searchParams.toString());
      if (quickSearchInput) sp.set('name', quickSearchInput);
      else sp.delete('name');
      sp.set('skip', '0');
      setSearchParams(sp);
    }, 300);
    return () => clearTimeout(handle);
  }, [quickSearchInput]);

  useEffect(() => {
    if (state.createTds.message) {
      if (state.createTds.hasErrors) message.error(state.createTds.message);
      else message.success(state.createTds.message);
      dispatch(clearTdsMessage());
    }
  }, [state.createTds.message]);

  useEffect(() => {
    if (state.editById.message) {
      if (state.editById.hasErrors) message.error(state.editById.message);
      else message.success(state.editById.message);
      dispatch(clearTdsMessage());
    }
  }, [state.editById.message]);

  useEffect(() => {
    if (state.removeById.message) {
      if (state.removeById.hasErrors) message.error(state.removeById.message);
      else message.success(state.removeById.message);
      dispatch(clearTdsMessage());
    }
  }, [state.removeById.message]);

  useEffect(() => {
    if (state.updateById.message) {
      if (state.updateById.hasErrors) message.error(state.updateById.message);
      else message.success(state.updateById.message);
      dispatch(clearTdsMessage());
    }
  }, [state.updateById.message]);

  useEffect(() => {
    if (state.tdsData.message && state.tdsData.hasErrors) {
      message.error(state.tdsData.message);
      dispatch(clearTdsMessage());
    }
  }, [state.tdsData.message, state.tdsData.hasErrors]);

  const rows = state.tdsData.data?.rows ?? [];
  const meta = state.tdsData.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = state.tdsData.loading;

  const isEdit = editingRecord !== undefined;
  const isSubmitting = state.createTds.loading || state.editById.loading;

  const refreshCurrent = () => {
    dispatch(searchTdsData(dataConvertFromSearchParm()));
  };

  const handleSort = (key: SortKey) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('skip', '0');
    if (sortKey !== key) {
      sp.set('orderBy', key);
      sp.set('order', 'ASC');
    } else if (sortDir === 'ASC') {
      sp.set('orderBy', key);
      sp.set('order', 'DESC');
    } else {
      sp.delete('orderBy');
      sp.delete('order');
    }
    setSearchParams(sp);
  };

  const onFinish = (values: ITdsFilterValues) => {
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
      .map(([key, val]) => `${key}=${encodeURIComponent(val as string)}`)
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
    setEditingRecord(undefined);
    setIsFormDrawerOpen(true);
  };

  const openEditDrawer = (row: ITdsDetails) => {
    setEditingRecord({
      id: row.id,
      code: row.code ?? '',
      name: row.name ?? '',
      percentage: Number(row.percentage),
      status: row.status,
    });
    setIsFormDrawerOpen(true);
  };

  const handleFormSubmit = async (values: ITdsRecord) => {
    if (isEdit && editingRecord) {
      const result = await dispatch(
        editTdsById({
          id: editingRecord.id,
          code: values.code,
          name: values.name,
          percentage: Number(values.percentage),
        }),
      );
      if (editTdsById.fulfilled.match(result)) {
        setIsFormDrawerOpen(false);
        refreshCurrent();
      }
    } else {
      const result = await dispatch(
        createNewTds({
          code: values.code,
          name: values.name,
          percentage: Number(values.percentage),
        } as ITdsDetails),
      );
      if (createNewTds.fulfilled.match(result)) {
        setIsFormDrawerOpen(false);
        if (skip === 0) {
          refreshCurrent();
        } else {
          const sp = new URLSearchParams(searchParams.toString());
          sp.set('skip', '0');
          setSearchParams(sp);
        }
      }
    }
  };

  const handleToggleStatus = async (row: ITdsDetails, checked: boolean) => {
    const result = await dispatch(
      updateTdsStatus({ id: row.id, status: checked }),
    );
    if (updateTdsStatus.fulfilled.match(result)) refreshCurrent();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteRow) return;
    const result = await dispatch(removeTdsById(confirmDeleteRow.id));
    setConfirmDeleteRow(null);
    if (removeTdsById.fulfilled.match(result)) {
      if (rows.length === 1 && page > 1) {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set('skip', String(Math.max(0, (page - 2) * take)));
        setSearchParams(sp);
      } else {
        refreshCurrent();
      }
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-emerald-600" />
              TDS
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} TDS rate{totalCount === 1 ? '' : 's'} configured
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search by name or code…"
                className="pl-9 pr-3 py-2 rounded-xl text-sm soft-input w-56"
              />
            </div>

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

            <Can I={Common.Actions.CAN_ADD} a={Common.Modules.MASTER.TDS}>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New TDS
              </button>
            </Can>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                <th className="w-16 pl-6 pr-4 py-3 bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No
                </th>
                {TABLE_COLUMNS.map((col) => {
                  const active = sortKey === col.key;
                  return (
                    <Fragment key={col.key}>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleSort(col.key)}
                          className={`flex items-center gap-1 select-none transition ${
                            active
                              ? 'text-emerald-700'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {col.label}
                          <ChevronsUpDown
                            size={12}
                            className={
                              active ? 'text-emerald-600' : 'text-gray-400'
                            }
                          />
                        </button>
                      </th>
                    </Fragment>
                  );
                })}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && (
                <TableRowSkeleton
                  rows={Math.min(take, 10)}
                  columns={[
                    { key: 'code', width: 'w-20' },
                    { key: 'name', width: 'w-40' },
                    { key: 'percentage', width: 'w-20' },
                    { key: 'created', width: 'w-24' },
                    { key: 'status', width: 'w-20' },
                  ]}
                />
              )}
              {rows.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-slate-50/60">
                  <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                    {(page - 1) * take + index + 1}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <span className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {row.code}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <p className="font-semibold text-gray-900 text-sm">
                      {showTooltip(row.name, 40)}
                    </p>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      {formatPercentage(row.percentage)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {formatDate(
                      (row as unknown as Record<string, unknown>).created_date,
                    )}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!row.status}
                      onClick={() => handleToggleStatus(row, !row.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                        row.status ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                          row.status ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span
                      className={`ml-2 text-xs font-medium ${
                        row.status ? 'text-emerald-700' : 'text-gray-500'
                      }`}
                    >
                      {row.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <div className="flex items-center gap-2">
                      <Can
                        I={Common.Actions.CAN_UPDATE}
                        a={Common.Modules.MASTER.TDS}
                      >
                        <button
                          type="button"
                          onClick={() => openEditDrawer(row)}
                          aria-label={`Edit ${row.name}`}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                        >
                          <Pencil size={14} />
                        </button>
                      </Can>
                      <Can
                        I={Common.Actions.CAN_DELETE}
                        a={Common.Modules.MASTER.TDS}
                      >
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteRow(row)}
                          aria-label={`Delete ${row.name}`}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={TABLE_COLUMNS.length + 2}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={28} className="text-gray-300" />
                      <p>No TDS rates found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new TDS rate.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination meta={meta} defaultPageSize={DEFAULT_TAKE} />
      </div>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter TDS"
        subtitle="Narrow down the TDS list"
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
            name="name"
            rules={rules.name}
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name / Code
              </span>
            }
          >
            <Input
              placeholder="Enter name or code"
              className="rounded-xl soft-input !py-2"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </span>
            }
          >
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = (formValues.status ?? '') === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      filterForm.setFieldsValue({ status: opt.value });
                      setFormValues((prev) => ({ ...prev, status: opt.value }));
                    }}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      <FormModal
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        title={isEdit ? 'Edit TDS' : 'Create New TDS'}
        subtitle={
          isEdit
            ? 'Update the TDS rate details and save your changes.'
            : 'Add a new TDS rate.'
        }
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
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        <TdsAdd
          data={editingRecord}
          onSubmit={handleFormSubmit}
          myRef={submitBtnRef}
        />
      </FormModal>

      {confirmDeleteRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-50">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delete TDS
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-900">
                      {confirmDeleteRow.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteRow(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={state.removeById.loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {state.removeById.loading && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TdsPage;
