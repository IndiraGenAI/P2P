import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import {
  CheckCircle2,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { Common } from '@/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import {
  createNewPurchaseRequest,
  editPurchaseRequestById,
  fetchPurchaseRequestById,
  removePurchaseRequestById,
  searchPurchaseRequestData,
  updatePurchaseRequestStatus,
} from '@/state/purchaseRequest/purchaseRequest.action';
import {
  clearCurrentPurchaseRequest,
  clearPurchaseRequestMessage,
  purchaseRequestSelector,
} from '@/state/purchaseRequest/purchaseRequest.reducer';
import vendorService, {
  type IVendorRow,
} from '@/services/vendor/vendor.service';
import paymentTermService, {
  type IPaymentTermRow,
} from '@/services/paymentTerm/paymentTerm.service';
import itemTypeService, {
  type IItemTypeRow,
} from '@/services/itemType/itemType.service';
import itemService, {
  type IItemRow,
} from '@/services/item/item.service';
import departmentService from '@/services/department/department.service';
import subdepartmentService from '@/services/subdepartment/subdepartment.service';
import centerService from '@/services/center/center.service';
import entityService from '@/services/entity/entity.service';
import type { SelectOption } from '@/common/models';
import type {
  IPurchaseRequestRow,
  PurchaseRequestStatus,
} from '@/services/purchaseRequest/purchaseRequest.service';
import {
  buildRecordFromRow,
  type IPurchaseRequestRecord,
} from './PurchaseRequest.model';
import PurchaseRequestAdd from './Add';

const DEFAULT_TAKE = 10;
const NON_FILTER_KEYS = new Set(['take', 'skip', 'orderBy', 'order']);

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-50 text-blue-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-amber-50 text-amber-700',
  CLOSED: 'bg-slate-100 text-slate-600',
};

const STATUS_OPTIONS: { value: '' | PurchaseRequestStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'CLOSED', label: 'Closed' },
];

const formatDate = (value: unknown): string => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatMoney = (value: unknown): string => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const useFkOptions = () => {
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [vendorSites, setVendorSites] = useState<SelectOption[]>([]);
  const [entities, setEntities] = useState<SelectOption[]>([]);
  const [itemTypes, setItemTypes] = useState<SelectOption[]>([]);
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [subdepartments, setSubdepartments] = useState<SelectOption[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<SelectOption[]>([]);
  const [centers, setCenters] = useState<SelectOption[]>([]);
  const [items, setItems] = useState<SelectOption[]>([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');

    vendorService
      .search(params)
      .then((res) => {
        const rows = (res.data as { rows: IVendorRow[] }).rows ?? [];
        setVendors(
          rows.map((r) => ({
            value: String(r.id),
            label: r.code ? `${r.code} — ${r.name}` : r.name,
          })),
        );
      })
      .catch(() => setVendors([]));

    paymentTermService
      .search(params)
      .then((res) => {
        const rows = (res.data as { rows: IPaymentTermRow[] }).rows ?? [];
        setPaymentTerms(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setPaymentTerms([]));

    itemTypeService
      .search(params)
      .then((res) => {
        const rows = (res.data as { rows: IItemTypeRow[] }).rows ?? [];
        setItemTypes(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setItemTypes([]));

    itemService
      .search(params)
      .then((res) => {
        const rows = (res.data as { rows: IItemRow[] }).rows ?? [];
        setItems(
          rows.map((r) => ({
            value: String(r.id),
            label: r.code ? `${r.code} — ${r.name}` : r.name,
          })),
        );
      })
      .catch(() => setItems([]));

    departmentService
      .searchDepartmentData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; name: string }[];
          })?.rows ?? [];
        setDepartments(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setDepartments([]));

    subdepartmentService
      .searchSubdepartmentData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; name: string }[];
          })?.rows ?? [];
        setSubdepartments(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setSubdepartments([]));

    centerService
      .searchCenterData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; name: string }[];
          })?.rows ?? [];
        setCenters(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setCenters([]));

    entityService
      .searchEntityData(Object.fromEntries(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; name: string }[];
          })?.rows ?? [];
        setEntities(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
        );
      })
      .catch(() => setEntities([]));
  }, []);

  // Vendor sites are large – just empty for now; can be filtered by vendor later.
  return {
    vendors,
    vendorSites,
    entities,
    itemTypes,
    departments,
    subdepartments,
    paymentTerms,
    centers,
    items,
    setVendorSites,
  };
};

export const PurchaseRequestPage = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(purchaseRequestSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterForm] = Form.useForm();

  const fkOptions = useFkOptions();

  const take = Number(searchParams.get('take')) || DEFAULT_TAKE;
  const skip = Number(searchParams.get('skip')) || 0;
  const page = Math.floor(skip / take) + 1;

  const [quickSearchInput, setQuickSearchInput] = useState(
    searchParams.get('search') ?? '',
  );
  const [filterCount, setFilterCount] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<
    IPurchaseRequestRecord | undefined
  >(undefined);
  const [confirmDeleteRow, setConfirmDeleteRow] =
    useState<IPurchaseRequestRow | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const dataFromSearch = (): Record<string, unknown> => {
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
    dispatch(searchPurchaseRequestData(dataFromSearch()));
  }, [searchParams]);

  useEffect(() => {
    const data: Record<string, string> = {};
    let count = 0;
    searchParams.forEach((value, key) => {
      if (NON_FILTER_KEYS.has(key)) return;
      data[key] = value;
      if (value !== '' && value !== undefined) count += 1;
    });
    setFormValues(data);
    setFilterCount(count);
    setQuickSearchInput(data.search ?? '');
  }, [searchParams]);

  useEffect(() => {
    filterForm.resetFields();
  }, [formValues]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((searchParams.get('search') ?? '') === quickSearchInput) return;
      const sp = new URLSearchParams(searchParams.toString());
      if (quickSearchInput) sp.set('search', quickSearchInput);
      else sp.delete('search');
      sp.set('skip', '0');
      setSearchParams(sp);
    }, 300);
    return () => clearTimeout(handle);
  }, [quickSearchInput]);

  // Toast effects
  useEffect(() => {
    if (state.create.message) {
      if (state.create.hasErrors) message.error(state.create.message);
      else message.success(state.create.message);
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.create.message]);
  useEffect(() => {
    if (state.edit.message) {
      if (state.edit.hasErrors) message.error(state.edit.message);
      else message.success(state.edit.message);
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.edit.message]);
  useEffect(() => {
    if (state.remove.message) {
      if (state.remove.hasErrors) message.error(state.remove.message);
      else message.success(state.remove.message);
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.remove.message]);
  useEffect(() => {
    if (state.status.message) {
      if (state.status.hasErrors) message.error(state.status.message);
      else message.success(state.status.message);
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.status.message]);

  // When edit drawer opens, fetch full record (with items)
  useEffect(() => {
    if (
      isFormDrawerOpen &&
      editingRecord?.id &&
      state.current.data?.id !== editingRecord.id
    ) {
      dispatch(fetchPurchaseRequestById(editingRecord.id));
    }
  }, [isFormDrawerOpen, editingRecord?.id]);

  useEffect(() => {
    if (
      isFormDrawerOpen &&
      editingRecord?.id &&
      state.current.data?.id === editingRecord.id
    ) {
      setEditingRecord(buildRecordFromRow(state.current.data));
    }
  }, [state.current.data?.id]);

  const rows = state.list.data?.rows ?? [];
  const meta = state.list.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = state.list.loading;
  const isEdit = editingRecord !== undefined;
  const isSubmitting = state.create.loading || state.edit.loading;

  const refresh = () => dispatch(searchPurchaseRequestData(dataFromSearch()));

  const openCreateDrawer = () => {
    setEditingRecord(undefined);
    dispatch(clearCurrentPurchaseRequest());
    setIsFormDrawerOpen(true);
  };

  const openEditDrawer = (row: IPurchaseRequestRow) => {
    setEditingRecord(buildRecordFromRow(row));
    setIsFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    setIsFormDrawerOpen(false);
    dispatch(clearCurrentPurchaseRequest());
  };

  const handleFormSubmit = async (values: IPurchaseRequestRecord) => {
    const payload = {
      pr_number: values.pr_number || undefined,
      entity_id: values.entity_id ?? null,
      vendor_id: values.vendor_id ?? null,
      vendor_site_id: values.vendor_site_id ?? null,
      item_type_id: values.item_type_id ?? null,
      validity_from: values.validity_from || null,
      validity_to: values.validity_to || null,
      required_date: values.required_date || null,
      frequency: values.frequency || null,
      department_id: values.department_id ?? null,
      subdepartment_id: values.subdepartment_id ?? null,
      payment_term_id: values.payment_term_id ?? null,
      center_id: values.center_id ?? null,
      remarks: values.remarks || null,
      terms_conditions: values.terms_conditions || null,
      overall_summary: values.overall_summary || null,
      net_amount: values.net_amount,
      status: values.status,
      items: values.items,
    };
    if (isEdit && editingRecord) {
      const result = await dispatch(
        editPurchaseRequestById({ id: editingRecord.id, ...payload }),
      );
      if (result.meta.requestStatus === 'fulfilled') {
        closeFormDrawer();
        refresh();
      }
    } else {
      const result = await dispatch(createNewPurchaseRequest(payload));
      if (result.meta.requestStatus === 'fulfilled') {
        closeFormDrawer();
        if (skip === 0) refresh();
        else {
          const sp = new URLSearchParams(searchParams.toString());
          sp.set('skip', '0');
          setSearchParams(sp);
        }
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteRow) return;
    const result = await dispatch(removePurchaseRequestById(confirmDeleteRow.id));
    setConfirmDeleteRow(null);
    if (result.meta.requestStatus === 'fulfilled') {
      if (rows.length === 1 && page > 1) {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set('skip', String(Math.max(0, (page - 2) * take)));
        setSearchParams(sp);
      } else {
        refresh();
      }
    }
  };

  const handleStatusChange = async (
    row: IPurchaseRequestRow,
    nextStatus: PurchaseRequestStatus,
  ) => {
    const result = await dispatch(
      updatePurchaseRequestStatus({ id: row.id, status: nextStatus }),
    );
    if (result.meta.requestStatus === 'fulfilled') refresh();
  };

  const onFinishFilter = (values: Record<string, unknown>) => {
    const existing: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      existing[key] = value;
    });
    const merged = { ...existing, ...values };
    const queryString = Object.entries(merged)
      .filter(
        ([key, val]) =>
          val !== undefined && val !== '' && val !== null && key !== 'skip',
      )
      .map(([key, val]) => `${key}=${encodeURIComponent(val as string)}`)
      .join('&');
    const next = new URLSearchParams(queryString);
    if (!next.has('take')) next.set('take', String(take));
    next.set('skip', '0');
    setSearchParams(next);
    setIsFilterDrawerOpen(false);
  };

  const onResetFilter = () => {
    const sp = new URLSearchParams();
    sp.set('take', String(take));
    sp.set('skip', '0');
    setSearchParams(sp);
    filterForm.resetFields();
    setIsFilterDrawerOpen(false);
  };

  const tableHead = useMemo(
    () => [
      'PR Number',
      'Vendor',
      'Department',
      'Required',
      'Net Amount',
      'Status',
      'Created',
      'Actions',
    ],
    [],
  );

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={18} className="text-emerald-600" />
              Purchase Request
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount}{' '}
              {totalCount === 1 ? 'purchase request' : 'purchase requests'}{' '}
              configured
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
                placeholder="Search PR # or vendor…"
                className="pl-9 pr-3 py-2 rounded-xl text-sm soft-input w-60"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
            >
              Filter <Filter size={14} />
              {filterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>

            <Can
              I={Common.Actions.CAN_ADD}
              a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
            >
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New Purchase Request
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
                {tableHead.map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && (
                <TableRowSkeleton
                  rows={Math.min(take, 10)}
                  columns={tableHead.map((h) => ({ key: h, width: 'w-24' }))}
                />
              )}
              {rows.map((row, index) => {
                const status = (row.status ?? 'DRAFT') as PurchaseRequestStatus;
                const badgeClass =
                  STATUS_BADGE[status] ?? 'bg-gray-100 text-gray-700';
                return (
                  <tr
                    key={row.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                      {(page - 1) * take + index + 1}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <span className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {row.pr_number ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <p className="text-sm font-medium text-gray-900">
                        {row.vendor?.name ?? (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </p>
                      {row.vendor_site?.site_name && (
                        <p className="text-xs text-gray-500">
                          {row.vendor_site.site_name}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm text-gray-700">
                      {row.department?.name ?? (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm text-gray-700">
                      {formatDate(row.required_date)}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm font-semibold text-emerald-700 text-right tabular-nums">
                      {formatMoney(row.net_amount)}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <span
                        className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm text-gray-600">
                      {formatDate(row.updated_date ?? row.created_date)}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <div className="flex items-center gap-1.5">
                        {status === 'DRAFT' && (
                          <Can
                            I={Common.Actions.CAN_UPDATE}
                            a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
                          >
                            <button
                              type="button"
                              onClick={() => handleStatusChange(row, 'SUBMITTED')}
                              title="Submit for approval"
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          </Can>
                        )}
                        {status === 'SUBMITTED' && (
                          <Can
                            I={Common.Actions.CAN_UPDATE}
                            a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
                          >
                            <button
                              type="button"
                              onClick={() => handleStatusChange(row, 'APPROVED')}
                              title="Approve"
                              className="p-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(row, 'REJECTED')}
                              title="Reject"
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <XCircle size={14} />
                            </button>
                          </Can>
                        )}
                        <Can
                          I={Common.Actions.CAN_UPDATE}
                          a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
                        >
                          <button
                            type="button"
                            onClick={() => openEditDrawer(row)}
                            aria-label={`Edit PR ${row.pr_number}`}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                          >
                            <Pencil size={14} />
                          </button>
                        </Can>
                        <Can
                          I={Common.Actions.CAN_DELETE}
                          a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
                        >
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRow(row)}
                            aria-label={`Delete PR ${row.pr_number}`}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart size={28} className="text-gray-300" />
                      <p>No purchase requests found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new purchase
                        request.
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

      {/* Filter drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Purchase Requests"
        subtitle="Narrow down the list"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetFilter}
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
          onFinish={onFinishFilter}
          initialValues={formValues}
          className="space-y-3"
        >
          <Form.Item
            name="search"
            label={
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PR # / Vendor
              </span>
            }
          >
            <Input
              placeholder="Enter PR number or vendor name"
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
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = (formValues.status ?? '') === opt.value;
                return (
                  <button
                    key={opt.value || 'all'}
                    type="button"
                    onClick={() => {
                      filterForm.setFieldsValue({ status: opt.value });
                      setFormValues((prev) => ({
                        ...prev,
                        status: opt.value,
                      }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
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

      {/* Form modal */}
      <FormModal
        isOpen={isFormDrawerOpen}
        onClose={closeFormDrawer}
        size="xl"
        title={isEdit ? 'Edit Purchase Request' : 'New Purchase Request'}
        subtitle={
          isEdit
            ? 'Update header & line items.'
            : 'Create a new purchase request with items.'
        }
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeFormDrawer}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => submitBtnRef.current?.click()}
              disabled={isSubmitting || (isEdit && state.current.loading)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {(isSubmitting || (isEdit && state.current.loading)) && (
                <Loader2 size={14} className="animate-spin" />
              )}
              {isEdit ? 'Update PR' : 'Create PR'}
            </button>
          </div>
        }
      >
        {isEdit && state.current.loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Loading purchase request…
          </div>
        ) : (
          <PurchaseRequestAdd
            data={editingRecord}
            onSubmit={handleFormSubmit}
            myRef={submitBtnRef}
            vendors={fkOptions.vendors}
            vendorSites={fkOptions.vendorSites}
            entities={fkOptions.entities}
            itemTypes={fkOptions.itemTypes}
            departments={fkOptions.departments}
            subdepartments={fkOptions.subdepartments}
            paymentTerms={fkOptions.paymentTerms}
            centers={fkOptions.centers}
            items={fkOptions.items}
          />
        )}
      </FormModal>

      {/* Delete confirm */}
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
                    Delete Purchase Request
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-900">
                      {confirmDeleteRow.pr_number}
                    </span>
                    ? Items and documents will be cascaded.
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
};

export default PurchaseRequestPage;
