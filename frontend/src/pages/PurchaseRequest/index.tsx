import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import { Eye, Filter, Loader2, Plus, ShoppingCart } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { Common } from '@/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import {
  createNewPurchaseRequest,
  searchPurchaseRequestData,
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
import purchaseRequestService, {
  type IPurchaseRequestStatusCounts,
  type PurchaseRequestStatus,
} from '@/services/purchaseRequest/purchaseRequest.service';
import {
  buildRecordFromRow,
  type IPurchaseRequestRecord,
} from './PurchaseRequest.model';
import PurchaseRequestAdd from './Add';
import type { ISubdepartmentOption } from './Add/Add.model';

const DEFAULT_TAKE = 10;
/** Paging, sort, and list tab `status` are not counted toward the Filter drawer badge. */
const NON_FILTER_KEYS = new Set(['take', 'skip', 'orderBy', 'order', 'status']);

/** URL / UI uses `PENDING`; the API still filters on `SUBMITTED` for that queue. */
type PrListTabStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const PR_LIST_TAB_STATUSES: readonly PrListTabStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
] as const;

const parseListTabStatus = (raw: string | null): '' | PrListTabStatus => {
  const s = raw ?? '';
  if (s === '') return '';
  const u = s.toUpperCase();
  if (u === 'PENDING' || u === 'SUBMITTED') return 'PENDING';
  if (u === 'APPROVED') return 'APPROVED';
  if (u === 'REJECTED') return 'REJECTED';
  return '';
};

/** Matches Pending tab (amber); SUBMITTED is the same workflow stage as “Pending”. */
const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-amber-50 text-amber-800',
  CLOSED: 'bg-slate-100 text-slate-600',
};

const statusBadgeClass = (raw: string | null | undefined): string => {
  const key = String(raw ?? 'DRAFT').toUpperCase();
  return STATUS_BADGE[key] ?? 'bg-slate-50 text-slate-600 ring-1 ring-slate-200';
};

/** User-facing label in the table (never show "Submitted"). */
const formatStatusLabel = (raw: string | null | undefined): string => {
  const u = String(raw ?? '').toUpperCase();
  if (u === 'SUBMITTED' || u === 'PENDING') return 'PENDING';
  return u || '—';
};

const STATUS_OPTIONS: { value: '' | PrListTabStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
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

const CURRENCY_SYMBOL = '\u20B9';

const formatMoney = (value: unknown): string => {
  const num = Number(value ?? 0);
  const formatted = Number.isNaN(num)
    ? '0.00'
    : num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return `${CURRENCY_SYMBOL} ${formatted}`;
};

const useFkOptions = () => {
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [entities, setEntities] = useState<SelectOption[]>([]);
  const [itemTypes, setItemTypes] = useState<SelectOption[]>([]);
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [subdepartments, setSubdepartments] = useState<ISubdepartmentOption[]>(
    [],
  );
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
            rows?: { id: number; name: string; department_id: number }[];
          })?.rows ?? [];
        setSubdepartments(
          rows.map((r) => ({
            value: String(r.id),
            label: r.name,
            department_id: String(r.department_id ?? ''),
          })),
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

  return {
    vendors,
    entities,
    itemTypes,
    departments,
    subdepartments,
    paymentTerms,
    centers,
    items,
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

  const [filterCount, setFilterCount] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<IPurchaseRequestRecord | null>(
    null,
  );
  const [viewLoading, setViewLoading] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const activeStatus = parseListTabStatus(searchParams.get('status'));

  const [statusCounts, setStatusCounts] =
    useState<IPurchaseRequestStatusCounts>({
      ALL: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    });

  const refreshStatusCounts = () => {
    purchaseRequestService
      .getStatusCounts()
      .then((res) => {
        if (res?.data) setStatusCounts(res.data);
      })
      .catch(() => {});
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewRecord(null);
    setViewLoading(false);
  };

  const openViewPurchaseRequest = (id: number) => {
    setIsViewModalOpen(true);
    setViewLoading(true);
    setViewRecord(null);
    purchaseRequestService
      .getById(id)
      .then((res) => {
        if (res?.data) setViewRecord(buildRecordFromRow(res.data));
        else {
          message.error('Could not load purchase request.');
          closeViewModal();
        }
      })
      .catch(() => {
        message.error('Could not load purchase request.');
        closeViewModal();
      })
      .finally(() => setViewLoading(false));
  };

  const dataFromSearch = (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    if (!data.take) data.take = DEFAULT_TAKE;
    if (!data.skip) data.skip = 0;
    if (String(data.status ?? '').toUpperCase() === 'PENDING') {
      data.status = 'SUBMITTED';
    }
    return data;
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    let fix = false;
    if (!sp.has('take')) {
      sp.set('take', String(DEFAULT_TAKE));
      fix = true;
    }
    if (!sp.has('skip')) {
      sp.set('skip', '0');
      fix = true;
    }
    const st = sp.get('status');
    if (st != null && st !== '') {
      const u = st.toUpperCase();
      if (u === 'SUBMITTED') {
        sp.set('status', 'PENDING');
        fix = true;
      } else if (!PR_LIST_TAB_STATUSES.includes(u as PrListTabStatus)) {
        sp.delete('status');
        fix = true;
      }
    }
    if (fix) {
      setSearchParams(sp, { replace: true });
      return;
    }
    dispatch(searchPurchaseRequestData(dataFromSearch()));
  }, [searchParams]);

  useEffect(() => {
    refreshStatusCounts();
  }, []);

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
  }, [searchParams]);

  useEffect(() => {
    filterForm.resetFields();
  }, [formValues]);

  // Toast effects
  useEffect(() => {
    if (state.create.message) {
      if (state.create.hasErrors) message.error(state.create.message);
      else message.success(state.create.message);
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.create.message]);

  const rows = state.list.data?.rows ?? [];
  const meta = state.list.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = state.list.loading;
  const isSubmitting = state.create.loading;

  const openCreateDrawer = () => {
    dispatch(clearCurrentPurchaseRequest());
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
      status: 'SUBMITTED',
      items: values.items,
    };
    const result = await dispatch(createNewPurchaseRequest(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      closeFormDrawer();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('status', 'PENDING');
      sp.set('skip', '0');
      if (!sp.has('take')) sp.set('take', String(take));
      setSearchParams(sp);
      refreshStatusCounts();
    }
  };

  const setStatusTab = (status: '' | PrListTabStatus) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (status === '') sp.delete('status');
    else sp.set('status', status);
    sp.set('skip', '0');
    setSearchParams(sp);
  };

  const STATUS_TABS: {
    key: '' | PrListTabStatus;
    label: string;
    countKey: keyof IPurchaseRequestStatusCounts;
    text: string;
    badge: string;
    activeRing: string;
  }[] = [
    {
      key: '',
      label: 'All',
      countKey: 'ALL',
      text: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-600',
      activeRing: 'ring-1 ring-gray-300',
    },
    {
      key: 'PENDING',
      label: 'Pending',
      countKey: 'PENDING',
      text: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-600',
      activeRing: 'ring-1 ring-amber-300',
    },
    {
      key: 'APPROVED',
      label: 'Approved',
      countKey: 'APPROVED',
      text: 'text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-600',
      activeRing: 'ring-1 ring-emerald-300',
    },
    {
      key: 'REJECTED',
      label: 'Rejected',
      countKey: 'REJECTED',
      text: 'text-red-500',
      badge: 'bg-red-50 text-red-500',
      activeRing: 'ring-1 ring-red-300',
    },
  ];

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

  const tableHead = useMemo<
    {
      label: string;
      align?: 'left' | 'right' | 'center';
      /** Shimmer cell width (Actions stays narrow). */
      skeletonWidth?: string;
    }[]
  >(
    () => [
      { label: 'PR Number' },
      { label: 'Vendor' },
      { label: 'Department' },
      { label: 'Required' },
      { label: 'Net Amount', align: 'right' },
      { label: 'Status' },
      { label: 'Created' },
      { label: 'Actions', align: 'center', skeletonWidth: 'w-10' },
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
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_TABS.map((tab) => {
                const isActive = activeStatus === tab.key;
                const count = statusCounts[tab.countKey] ?? 0;
                return (
                  <button
                    key={tab.key || 'all'}
                    type="button"
                    onClick={() => setStatusTab(tab.key)}
                    className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium tracking-wide transition hover:border-gray-200 ${
                      tab.text
                    } ${isActive ? tab.activeRing : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`min-w-[20px] h-[20px] inline-flex items-center justify-center text-[10px] font-semibold rounded-full px-1 ${tab.badge}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn border border-gray-100"
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

        <div className="flex-1 overflow-auto relative pr-6">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                <th className="w-16 pl-6 pr-4 py-3 bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No
                </th>
                {tableHead.map((col) => {
                  const isActions = col.label === 'Actions';
                  const pad = isActions ? 'px-2' : 'px-4';
                  let alignClass = 'text-left';
                  if (col.align === 'right') alignClass = 'text-right';
                  else if (col.align === 'center') alignClass = 'text-center';
                  return (
                    <th
                      key={col.label}
                      className={`${pad} py-3 ${alignClass} ${
                        isActions ? 'w-[1%] whitespace-nowrap' : ''
                      } text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200`}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && (
                <TableRowSkeleton
                  rows={Math.min(take, 10)}
                  withActions={false}
                  columns={tableHead.map((h) => ({
                    key: h.label,
                    width: h.skeletonWidth ?? 'w-24',
                  }))}
                />
              )}
              {rows.map((row, index) => {
                const status = (row.status ?? 'DRAFT') as PurchaseRequestStatus;
                const badgeClass = statusBadgeClass(String(status));
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
                        {formatStatusLabel(String(status))}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm text-gray-600">
                      {formatDate(row.updated_date ?? row.created_date)}
                    </td>
                    <td className="w-[1%] whitespace-nowrap px-2 py-4 text-center border-b border-slate-100/80 align-middle">
                      <Can
                        I={Common.Actions.CAN_VIEW}
                        a={Common.Modules.PROCUREMENT.PURCHASE_REQUEST}
                      >
                        <button
                          type="button"
                          onClick={() => openViewPurchaseRequest(row.id)}
                          className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-200/90 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200 transition"
                          aria-label={`View purchase request ${row.pr_number ?? row.id}`}
                        >
                          <Eye size={16} strokeWidth={2} />
                        </button>
                      </Can>
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
        title="New Purchase Request"
        subtitle="Create a new purchase request with items."
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Create PR
            </button>
          </div>
        }
      >
        <PurchaseRequestAdd
          onSubmit={handleFormSubmit}
          myRef={submitBtnRef}
          vendors={fkOptions.vendors}
          entities={fkOptions.entities}
          itemTypes={fkOptions.itemTypes}
          departments={fkOptions.departments}
          subdepartments={fkOptions.subdepartments}
          paymentTerms={fkOptions.paymentTerms}
          centers={fkOptions.centers}
          items={fkOptions.items}
        />
      </FormModal>

      <FormModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        size="xl"
        title="Purchase Request"
        subtitle={
          viewRecord?.pr_number
            ? `PR ${viewRecord.pr_number}`
            : 'View submitted details'
        }
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeViewModal}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Close
            </button>
          </div>
        }
      >
        {viewLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-500">
            <Loader2 size={28} className="animate-spin text-emerald-600" />
            <p className="text-sm">Loading…</p>
          </div>
        )}
        {!viewLoading && viewRecord && (
          <PurchaseRequestAdd
            readOnly
            data={viewRecord}
            onSubmit={() => {}}
            vendors={fkOptions.vendors}
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
    </div>
  );
};

export default PurchaseRequestPage;
