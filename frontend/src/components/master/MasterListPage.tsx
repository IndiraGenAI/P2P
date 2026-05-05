import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import {
  ChevronsUpDown,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { Common } from '@/utils/constants/constant';
import { showTooltip, trimObject } from '@/utils/helperFunction';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import type { RootState } from '@/state/store';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

type SortKey = 'code' | 'name' | 'created_date' | 'status';
type SortDir = 'ASC' | 'DESC';

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

export interface IMasterRow {
  id: number;
  code?: string | null;
  name?: string | null;
  status?: boolean;
  created_date?: string | Date | null;
  updated_date?: string | Date | null;
}

export interface IMasterStateBlock {
  loading: boolean;
  hasErrors: boolean;
  message: string;
}

export interface IMasterStateShape<TRow extends IMasterRow = IMasterRow> {
  list: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: { rows: TRow[]; meta: IMetaProps };
  };
  create: IMasterStateBlock;
  edit: IMasterStateBlock;
  remove: IMasterStateBlock;
  status: IMasterStateBlock;
}

export interface IExtraColumn<TRow extends IMasterRow = IMasterRow> {
  key: string;
  label: string;
  render: (row: TRow) => ReactNode;
  sortable?: boolean;
  sortKey?: string;
}

export interface IMasterListPageProps<
  TRecord extends { id: number },
  TRow extends IMasterRow = IMasterRow,
> {
  pageCode: string;
  singularLabel: string;
  pluralLabel: string;
  icon: LucideIcon;
  selector: (state: RootState) => IMasterStateShape<TRow>;
  clearMessage: () => { type: string };
  searchAction: (params: Record<string, unknown>) => any;
  createAction: (data: any) => any;
  editAction: (data: any) => any;
  removeAction: (id: number) => any;
  updateStatusAction: (data: { id: number; status: boolean }) => any;
  buildRecordFromRow: (row: TRow) => TRecord;
  buildCreatePayload: (values: TRecord) => unknown;
  buildEditPayload: (values: TRecord, id: number) => unknown;
  AddForm: (props: {
    data?: TRecord;
    onSubmit: (val: TRecord) => void;
    myRef?: React.Ref<HTMLButtonElement>;
  }) => ReactElement;
  extraColumns?: IExtraColumn<TRow>[];
  showCodeColumn?: boolean;
  nameField?: string;
  nameRender?: (row: TRow) => ReactNode;
  filterFields?: ReactNode;
  formInitialValues?: Record<string, unknown>;
  formSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  submitButtonLabel?: { create?: string; update?: string };
  headerActions?: ReactNode | ((ctx: { refresh: () => void }) => ReactNode);
}

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export function MasterListPage<
  TRecord extends { id: number },
  TRow extends IMasterRow = IMasterRow,
>(props: IMasterListPageProps<TRecord, TRow>) {
  const {
    pageCode,
    singularLabel,
    pluralLabel,
    icon: Icon,
    selector,
    clearMessage,
    searchAction,
    createAction,
    editAction,
    removeAction,
    updateStatusAction,
    buildRecordFromRow,
    buildCreatePayload,
    buildEditPayload,
    AddForm,
    extraColumns = [],
    showCodeColumn = true,
    nameField = 'name',
    nameRender,
    filterFields,
    formSize = 'lg',
    submitButtonLabel,
    headerActions,
  } = props;

  const dispatch = useAppDispatch();
  const state = useAppSelector(selector);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterForm] = Form.useForm();

  const take = Number(searchParams.get('take')) || DEFAULT_TAKE;
  const skip = Number(searchParams.get('skip')) || 0;
  const page = Math.floor(skip / take) + 1;
  const sortKey = (searchParams.get('orderBy') ?? '') as SortKey | '';
  const sortDir = ((searchParams.get('order') ?? 'ASC').toUpperCase() === 'DESC'
    ? 'DESC'
    : 'ASC') as SortDir;

  const TABLE_COLUMNS = useMemo(() => {
    const cols: { key: SortKey | string; label: string; sortable?: boolean }[] =
      [];
    if (showCodeColumn)
      cols.push({ key: 'code', label: 'Code', sortable: true });
    cols.push({ key: nameField, label: singularLabel, sortable: true });
    extraColumns.forEach((c) =>
      cols.push({
        key: c.sortKey ?? c.key,
        label: c.label,
        sortable: !!c.sortable,
      }),
    );
    cols.push({ key: 'created_date', label: 'Created Date', sortable: true });
    cols.push({ key: 'status', label: 'Status', sortable: true });
    return cols;
  }, [extraColumns, singularLabel, showCodeColumn, nameField]);

  const [count, setCount] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TRecord | undefined>(
    undefined,
  );
  const [confirmDeleteRow, setConfirmDeleteRow] = useState<TRow | null>(null);

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const rowLabel = (row: TRow) => {
    const primary = (row as Record<string, unknown>)[nameField];
    if (primary != null && String(primary) !== '') return String(primary);
    const fallback = (row as IMasterRow).name;
    return fallback != null && String(fallback) !== ''
      ? String(fallback)
      : 'record';
  };

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
    dispatch(searchAction(dataConvertFromSearchParm()));
  }, [searchParams]);

  useEffect(() => {
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (NON_FILTER_KEYS.has(key)) return;
      data[key] = value;
    });
    setFormValues(data);
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
    if (state.create.message) {
      if (state.create.hasErrors) message.error(state.create.message);
      else message.success(state.create.message);
      dispatch(clearMessage());
    }
  }, [state.create.message]);
  useEffect(() => {
    if (state.edit.message) {
      if (state.edit.hasErrors) message.error(state.edit.message);
      else message.success(state.edit.message);
      dispatch(clearMessage());
    }
  }, [state.edit.message]);
  useEffect(() => {
    if (state.remove.message) {
      if (state.remove.hasErrors) message.error(state.remove.message);
      else message.success(state.remove.message);
      dispatch(clearMessage());
    }
  }, [state.remove.message]);
  useEffect(() => {
    if (state.status.message) {
      if (state.status.hasErrors) message.error(state.status.message);
      else message.success(state.status.message);
      dispatch(clearMessage());
    }
  }, [state.status.message]);
  useEffect(() => {
    if (state.list.message && state.list.hasErrors) {
      message.error(state.list.message);
      dispatch(clearMessage());
    }
  }, [state.list.message, state.list.hasErrors]);

  const rows = state.list.data?.rows ?? [];
  const meta = state.list.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = state.list.loading;
  const isEdit = editingRecord !== undefined;
  const isSubmitting = state.create.loading || state.edit.loading;

  const refreshCurrent = () => {
    dispatch(searchAction(dataConvertFromSearchParm()));
  };

  const handleSort = (key: string) => {
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

  const onFinish = (values: Record<string, unknown>) => {
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
          val !== null &&
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

  const openEditDrawer = (row: TRow) => {
    setEditingRecord(buildRecordFromRow(row));
    setIsFormDrawerOpen(true);
  };

  const handleFormSubmit = async (values: TRecord) => {
    if (isEdit && editingRecord) {
      const payload = buildEditPayload(values, editingRecord.id);
      const result = await dispatch(editAction(payload));
      if (result.meta.requestStatus === 'fulfilled') {
        setIsFormDrawerOpen(false);
        refreshCurrent();
      }
    } else {
      const payload = buildCreatePayload(values);
      const result = await dispatch(createAction(payload));
      if (result.meta.requestStatus === 'fulfilled') {
        setIsFormDrawerOpen(false);
        if (skip === 0) refreshCurrent();
        else {
          const sp = new URLSearchParams(searchParams.toString());
          sp.set('skip', '0');
          setSearchParams(sp);
        }
      }
    }
  };

  const handleToggleStatus = async (row: TRow, checked: boolean) => {
    const result = await dispatch(
      updateStatusAction({ id: row.id, status: checked }),
    );
    if (result.meta.requestStatus === 'fulfilled') refreshCurrent();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteRow) return;
    const result = await dispatch(removeAction(confirmDeleteRow.id));
    setConfirmDeleteRow(null);
    if (result.meta.requestStatus === 'fulfilled') {
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
              <Icon size={18} className="text-emerald-600" />
              {singularLabel}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} {totalCount === 1 ? singularLabel : pluralLabel}{' '}
              configured
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

            {headerActions && (
              <Can I={Common.Actions.CAN_ADD} a={pageCode}>
                <>
                  {typeof headerActions === 'function'
                    ? headerActions({ refresh: refreshCurrent })
                    : headerActions}
                </>
              </Can>
            )}

            <Can I={Common.Actions.CAN_ADD} a={pageCode}>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New {singularLabel}
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
                        {col.sortable ? (
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
                        ) : (
                          <span>{col.label}</span>
                        )}
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
                  columns={TABLE_COLUMNS.map((c) => ({
                    key: c.key,
                    width: 'w-24',
                  }))}
                />
              )}
              {rows.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-slate-50/60">
                  <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                    {(page - 1) * take + index + 1}
                  </td>
                  {showCodeColumn && (
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      {row.code ? (
                        <span className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {row.code}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <p className="font-semibold text-gray-900 text-sm">
                      {nameRender
                        ? nameRender(row)
                        : showTooltip(
                            ((row as Record<string, unknown>)[nameField] as
                              | string
                              | null
                              | undefined) ?? row.name,
                            40,
                          )}
                    </p>
                  </td>
                  {extraColumns.map((c) => (
                    <td
                      key={c.key}
                      className="px-4 py-4 text-sm text-gray-700 border-b border-slate-100/80"
                    >
                      {c.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {formatDate(row.updated_date ?? row.created_date)}
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
                      <Can I={Common.Actions.CAN_UPDATE} a={pageCode}>
                        <button
                          type="button"
                          onClick={() => openEditDrawer(row)}
                          aria-label={`Edit ${rowLabel(row)}`}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                        >
                          <Pencil size={14} />
                        </button>
                      </Can>
                      <Can I={Common.Actions.CAN_DELETE} a={pageCode}>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteRow(row)}
                          aria-label={`Delete ${rowLabel(row)}`}
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
                      <Icon size={28} className="text-gray-300" />
                      <p>No {pluralLabel.toLowerCase()} found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new{' '}
                        {singularLabel.toLowerCase()}.
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
        title={`Filter ${pluralLabel}`}
        subtitle={`Narrow down the ${pluralLabel.toLowerCase()} list`}
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

          {filterFields}

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
                      setFormValues((prev) => ({
                        ...prev,
                        status: opt.value,
                      }));
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
        size={formSize}
        title={isEdit ? `Edit ${singularLabel}` : `Create New ${singularLabel}`}
        subtitle={
          isEdit
            ? `Update the ${singularLabel.toLowerCase()} details and save your changes.`
            : `Add a new ${singularLabel.toLowerCase()}.`
        }
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormDrawerOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              {submitButtonLabel?.create && !isEdit ? 'Discard' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => submitBtnRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {(() => {
                if (isEdit) {
                  return submitButtonLabel?.update ?? `Update ${singularLabel}`;
                }
                return submitButtonLabel?.create ?? `Create ${singularLabel}`;
              })()}
            </button>
          </div>
        }
      >
        <AddForm
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
                    Delete {singularLabel}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-900">
                      {rowLabel(confirmDeleteRow)}
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
                disabled={state.remove.loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {state.remove.loading && (
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
}
