import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, message, Popover, Tooltip } from 'antd';
import { Eye, Filter, ListChecks, Loader2, Plus, ShoppingCart } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { Common } from '@/utils/constants/constant';
import vendorService from '@/services/vendor/vendor.service';
import paymentTermService from '@/services/paymentTerm/paymentTerm.service';
import itemTypeService from '@/services/itemType/itemType.service';
import itemService from '@/services/item/item.service';
import departmentService from '@/services/department/department.service';
import subdepartmentService from '@/services/subdepartment/subdepartment.service';
import centerService from '@/services/center/center.service';
import entityService from '@/services/entity/entity.service';
import termsConditionService from '@/services/termsCondition/termsCondition.service';
import currencyService from '@/services/currency/currency.service';
import gstService from '@/services/gst/gst.service';
import purchaseOrderService from '@/services/purchaseOrder/purchaseOrder.service';
import type { IPurchaseOrderRow } from '@/services/purchaseOrder/purchaseOrder.model';
import { purchaseOrderRowToRateContractRecord } from '@/pages/PurchaseOrder/poFormAdapter';
import type { SelectOption } from '@/common/models';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import { useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';
import grnService from '@/services/grn/grn.service';
import type {
  IGrnApprovalProgress,
  IGrnApprovalStepRow,
  IGrnPayload,
  IGrnRow,
  IGrnStatusCounts,
} from '@/services/grn/grn.model';
import {
  PurchaseRequestApprovalDecision,
  PurchaseRequestApprovalStepStatus,
  RcStatus,
} from '@/common/enums';
import { grnDetailToRcRecordShape } from './grnFormAdapter';
import rateContractService from '@/services/rateContract/rateContract.service';
import type { IRateContractDetail } from '@/services/rateContract/rateContract.model';
import {
  buildRecordFromRow,
  type IRateContractRecord,
} from '@/pages/RateContract/RateContract.model';
import RateContractAdd from '@/pages/RateContract/Add';
import type {
  IGstRateOption,
  ISubdepartmentOption,
} from '@/pages/RateContract/Add/Add.model';

const DEFAULT_TAKE = 10;
const NON_FILTER_KEYS = new Set([
  'take',
  'skip',
  'orderBy',
  'order',
  'status',
  'rcId',
  'poId',
]);

const RC_LIST_TAB_STATUSES = [
  RcStatus.PENDING,
  RcStatus.APPROVED,
  RcStatus.REJECTED,
] as const;

type RcListTabStatus = (typeof RC_LIST_TAB_STATUSES)[number];

const parseListTabStatus = (raw: string | null): '' | RcListTabStatus => {
  const s = raw ?? '';
  if (s === '') return '';
  const u = s.toUpperCase();
  if (u === RcStatus.PENDING || u === RcStatus.SUBMITTED) return RcStatus.PENDING;
  if (u === RcStatus.APPROVED) return RcStatus.APPROVED;
  if (u === RcStatus.REJECTED) return RcStatus.REJECTED;
  return '';
};

const STATUS_BADGE: Record<string, string> = {
  [RcStatus.DRAFT]: 'bg-gray-100 text-gray-700',
  [RcStatus.SUBMITTED]: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
  [RcStatus.PENDING]: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
  [RcStatus.APPROVED]: 'bg-emerald-50 text-emerald-700',
  [RcStatus.REJECTED]: 'bg-red-50 text-red-600',
  [RcStatus.CANCELLED]: 'bg-amber-50 text-amber-800',
  [RcStatus.CLOSED]: 'bg-slate-100 text-slate-600',
};

const statusBadgeClass = (raw: string | null | undefined): string => {
  const key = String(raw ?? RcStatus.DRAFT).toUpperCase();
  return STATUS_BADGE[key] ?? 'bg-slate-50 text-slate-600 ring-1 ring-slate-200';
};

const formatStatusLabel = (raw: string | null | undefined): string => {
  const u = String(raw ?? '').toUpperCase();
  if (u === RcStatus.SUBMITTED || u === RcStatus.PENDING) return RcStatus.PENDING;
  return u || '—';
};

const STATUS_OPTIONS: { value: '' | RcListTabStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: RcStatus.PENDING, label: 'Pending' },
  { value: RcStatus.APPROVED, label: 'Approved' },
  { value: RcStatus.REJECTED, label: 'Rejected' },
];

const searchParamsToRecord = (p: URLSearchParams): Record<string, string> => {
  const o: Record<string, string> = {};
  p.forEach((value, key) => {
    o[key] = value;
  });
  return o;
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
  return `${CURRENCY_SYMBOL}${formatted}`;
};

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

function readApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const m = err.message.trim();
    if (m) return m;
  }
  const raw = (
    err as { response?: { data?: { message?: unknown } } } | null
  )?.response?.data?.message;
  if (Array.isArray(raw)) {
    const t = raw.map((x) => String(x)).join(' ').trim();
    if (t) return t;
  }
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  return fallback;
}

type PageToast =
  | { variant: 'success'; text: string }
  | { variant: 'error'; text: string };

function localTodayYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function grnCreatePrefillFromApprovedRc(
  detail: IRateContractDetail,
): IRateContractRecord {
  const r = buildRecordFromRow(detail);
  return {
    ...r,
    id: 0,
    rc_number: '',
    invoice_no: '',
    invoice_date: localTodayYmd(),
    status: RcStatus.DRAFT,
    approval_steps: [],
    items: r.items.map(({ id: _lineId, ...line }) => ({ ...line })),
  };
}

function grnCreatePrefillFromApprovedPo(
  detail: IPurchaseOrderRow,
): IRateContractRecord {
  const r = purchaseOrderRowToRateContractRecord(detail);
  return {
    ...r,
    id: 0,
    rc_number: '',
    invoice_no: '',
    invoice_date: localTodayYmd(),
    status: RcStatus.DRAFT,
    approval_steps: [],
    items: r.items.map(({ id: _lineId, ...line }) => ({ ...line })),
  };
}

const { TextArea } = Input;

const RC_SECTION_TITLE =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-600 uppercase mb-4';
const RC_SECTION_DIVIDER = 'border-t border-gray-200 pt-6 mt-2';

function decodeJwtPayloadSegment(segment: string): string {
  let base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

function readJwtSubAndEmail(): { sub?: number; email?: string } {
  try {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('accessToken');
    if (!token) return {};
    const parts = token.split('.');
    if (parts.length < 2) return {};
    const raw = decodeJwtPayloadSegment(parts[1]);
    const payload = JSON.parse(raw) as {
      sub?: number | string;
      email?: string;
    };
    const n =
      typeof payload.sub === 'number'
        ? payload.sub
        : Number.parseInt(String(payload.sub), 10);
    const sub = Number.isFinite(n) ? n : undefined;
    const email =
      typeof payload.email === 'string' ? payload.email : undefined;
    return { sub, email };
  } catch {
    return {};
  }
}

function userMatchesApprovalAssignee(
  assignees: { user_id: number; user?: { email?: string } }[],
  userId: number | undefined,
  userEmail: string | undefined,
): boolean {
  const emailNorm = userEmail?.trim().toLowerCase();
  return assignees.some((a) => {
    if (
      userId != null &&
      Number.isFinite(userId) &&
      Number(a.user_id) === Number(userId)
    ) {
      return true;
    }
    if (emailNorm && a.user?.email?.trim().toLowerCase() === emailNorm) {
      return true;
    }
    return false;
  });
}

const approvalStepStatusBadgeClass = (
  raw: string | null | undefined,
): string => {
  const u = String(raw ?? '').toUpperCase();
  if (u === PurchaseRequestApprovalStepStatus.PENDING) {
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80';
  }
  if (u === PurchaseRequestApprovalStepStatus.APPROVED) {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80';
  }
  if (u === PurchaseRequestApprovalStepStatus.REJECTED) {
    return 'bg-red-50 text-red-600 ring-1 ring-red-200/80';
  }
  return 'bg-slate-50 text-slate-600 ring-1 ring-slate-200';
};

function RcWorkflowStepCell({
  rcId,
  progress,
}: {
  rcId: number;
  progress: IGrnApprovalProgress | null | undefined;
}) {
  const listSteps = progress?.steps;
  const hasStepTrail =
    (Array.isArray(listSteps) && listSteps.length > 0) ||
    (progress != null && Number(progress.total_steps) >= 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSteps, setFetchedSteps] = useState<
    IGrnApprovalStepRow[] | null
  >(null);
  const fetchDismissedRef = useRef(false);

  if (!hasStepTrail) {
    return <span className="line-clamp-2 text-gray-400">—</span>;
  }

  const popoverBody = loading ? (
    <div className="flex items-center justify-center gap-2 py-8 px-4 text-gray-500 text-sm">
      <Loader2 className="animate-spin text-emerald-600" size={18} />
      <span>Loading…</span>
    </div>
  ) : error ? (
    <p className="text-xs text-red-600 m-0 max-w-[300px] px-1">{error}</p>
  ) : fetchedSteps && fetchedSteps.length === 0 ? (
    <p className="text-xs text-gray-500 m-0 max-w-[300px] px-1">
      No workflow steps on file.
    </p>
  ) : fetchedSteps && fetchedSteps.length > 0 ? (
    <div className="w-[min(100vw-2rem,320px)] sm:w-[320px] max-h-[min(70vh,440px)] overflow-y-auto text-sm">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-500 uppercase m-0 mb-2">
        Approval trail
      </p>
      <ol className="relative space-y-2 m-0 p-0 list-none pl-1">
        {fetchedSteps.map((step, idx) => {
          const su = String(step.status).toUpperCase();
          const names = (step.assignees ?? [])
            .map((a) =>
              a.user
                ? `${a.user.first_name} ${a.user.last_name}`.trim()
                : `User #${a.user_id}`,
            )
            .join(', ');
          const isLast = idx === fetchedSteps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-2">
              <div
                className="flex flex-col items-center shrink-0 w-4"
                aria-hidden
              >
                <span
                  className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    step.step_role === 'APPROVER'
                      ? 'bg-emerald-500 ring-2 ring-emerald-100'
                      : 'bg-amber-500 ring-2 ring-amber-100'
                  }`}
                />
                {!isLast && (
                  <span className="w-px flex-1 min-h-[8px] mt-1 bg-gray-200" />
                )}
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-gray-100/90 bg-slate-50/50 px-2.5 py-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 m-0">
                      Step {step.sequence_order}:{' '}
                      {String(step.step_role).toUpperCase() === 'APPROVER'
                        ? 'Final approver'
                        : 'Reviewer'}
                    </p>
                    {names ? (
                      <p className="text-[11px] text-gray-500 mt-0.5 m-0">
                        <span className="text-gray-600">Assigned:</span>{' '}
                        <span className="text-gray-700">{names}</span>
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${approvalStepStatusBadgeClass(su)}`}
                  >
                    {su}
                  </span>
                </div>
                {step.acted_by_user ? (
                  <p className="mt-1.5 pt-1.5 border-t border-gray-200/80 text-[11px] text-gray-500 m-0">
                    {step.status === PurchaseRequestApprovalStepStatus.APPROVED
                      ? 'Approved'
                      : 'Decided'}{' '}
                    by {step.acted_by_user.first_name}{' '}
                    {step.acted_by_user.last_name}
                    {step.acted_at ? ` · ${formatDate(step.acted_at)}` : ''}
                    {step.remarks ? ` · ${step.remarks}` : ''}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-2 py-8 px-4 text-gray-500 text-sm">
      <Loader2 className="animate-spin text-emerald-600" size={18} />
      <span>Loading…</span>
    </div>
  );

  return (
    <div
      className="flex items-center justify-start"
      onClick={(e) => e.stopPropagation()}
    >
      <Popover
        trigger="click"
        placement="leftTop"
        zIndex={1070}
        getPopupContainer={() => document.body}
        onOpenChange={(visible) => {
          if (visible) {
            fetchDismissedRef.current = false;
            setLoading(true);
            setError(null);
            setFetchedSteps(null);
            void grnService
              .getApprovalTrail(rcId)
              .then((res) => {
                if (fetchDismissedRef.current) return;
                if (!res?.data) {
                  setError('Could not load workflow.');
                  setFetchedSteps([]);
                  return;
                }
                setFetchedSteps(res.data.approval_steps ?? []);
              })
              .catch((err: unknown) => {
                if (fetchDismissedRef.current) return;
                setError(
                  err instanceof Error
                    ? err.message
                    : 'Could not load workflow.',
                );
                setFetchedSteps(null);
              })
              .finally(() => {
                if (!fetchDismissedRef.current) setLoading(false);
              });
          } else {
            fetchDismissedRef.current = true;
            setLoading(false);
            setError(null);
            setFetchedSteps(null);
          }
        }}
        content={<div className="min-w-[200px]">{popoverBody}</div>}
      >
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200/90 bg-white text-gray-500 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200/80 transition"
        >
          <ListChecks size={14} strokeWidth={2} aria-hidden />
        </button>
      </Popover>
    </div>
  );
}

function useRateContractFkOptions() {
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
  const [termsConditions, setTermsConditions] = useState<SelectOption[]>([]);
  const [currencies, setCurrencies] = useState<SelectOption[]>([]);
  const [gstRates, setGstRates] = useState<IGstRateOption[]>([]);
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
        const rows = res.data?.rows ?? [];
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
        const rows = res.data?.rows ?? [];
        setPaymentTerms(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setPaymentTerms([]));

    itemTypeService
      .search(params)
      .then((res) => {
        const rows = res.data?.rows ?? [];
        setItemTypes(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setItemTypes([]));

    itemService
      .search(params)
      .then((res) => {
        const rows = res.data?.rows ?? [];
        setItems(
          rows.map((r) => ({
            value: String(r.id),
            label: r.code ? `${r.code} — ${r.name}` : r.name,
          })),
        );
      })
      .catch(() => setItems([]));

    departmentService
      .searchDepartmentData(searchParamsToRecord(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setDepartments(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setDepartments([]));

    subdepartmentService
      .searchSubdepartmentData(searchParamsToRecord(params))
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
      .searchCenterData(searchParamsToRecord(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setCenters(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setCenters([]));

    entityService
      .searchEntityData(searchParamsToRecord(params))
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setEntities(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setEntities([]));

    termsConditionService
      .search(params)
      .then((res) => {
        const rows = res.data?.rows ?? [];
        setTermsConditions(
          rows.map((r) => ({
            value: String(r.id),
            label: `${r.code} — ${r.name}`,
          })),
        );
      })
      .catch(() => setTermsConditions([]));

    currencyService
      .searchCurrencyData(searchParamsToRecord(params))
      .then((res) => {
        const rows = res.data?.rows ?? [];
        setCurrencies(
          rows.map((r) => ({
            value: String(r.id),
            label: `${r.code} — ${r.name}`,
          })),
        );
      })
      .catch(() => setCurrencies([]));

    gstService
      .searchGstData(params)
      .then((res) => {
        const rows = res.data?.rows ?? [];
        setGstRates(
          rows.map((r) => ({
            id: r.id,
            label: `${r.code} — ${Number(r.percentage)}%`,
            percentage: Number(r.percentage),
          })),
        );
      })
      .catch(() => setGstRates([]));
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
    termsConditions,
    currencies,
    gstRates,
  };
}

const GrnPage = () => {
  const fk = useRateContractFkOptions();
  const auth = useAppSelector(authSelector);
  const navigate = useNavigate();
  const { pathname: grnPathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isPoGrnRoute = grnPathname.startsWith('/purchase-order/grn');
  const grnListSource: 'po' | 'contract' = isPoGrnRoute ? 'po' : 'contract';
  const grnPageTitle = isPoGrnRoute ? 'PO GRN' : 'Contract GRN';
  const grnPageSubtitle = isPoGrnRoute
    ? 'Goods receipts against approved purchase orders.'
    : 'Goods receipts against approved rate contracts (purchase request flow).';
  const [filterForm] = Form.useForm();

  const take = Number(searchParams.get('take')) || DEFAULT_TAKE;
  const skip = Number(searchParams.get('skip')) || 0;
  const page = Math.floor(skip / take) + 1;

  const [rows, setRows] = useState<IGrnRow[]>([]);
  const [meta, setMeta] = useState<IMetaProps | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterCount, setFilterCount] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [createPrefill, setCreatePrefill] = useState<IRateContractRecord | null>(
    null,
  );
  const [createSourceRcId, setCreateSourceRcId] = useState<number | null>(null);
  const [createSourcePoId, setCreateSourcePoId] = useState<number | null>(null);
  const [createPrefillFromPo, setCreatePrefillFromPo] = useState(false);
  const [createPrefillLabel, setCreatePrefillLabel] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [pageToast, setPageToast] = useState<PageToast | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<IRateContractRecord | null>(
    null,
  );
  const [viewLoading, setViewLoading] = useState(false);
  const [viewLoadError, setViewLoadError] = useState<string | null>(null);
  const [viewModalId, setViewModalId] = useState<number | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [approvalDecisionLoading, setApprovalDecisionLoading] = useState(false);

  const [statusCounts, setStatusCounts] = useState<IGrnStatusCounts>({
    ALL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  });

  const activeStatus = parseListTabStatus(searchParams.get('status'));

  const rcIdQuery = searchParams.get('rcId');
  useEffect(() => {
    if (!rcIdQuery) return;
    if (isPoGrnRoute) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('rcId');
          return next;
        },
        { replace: true },
      );
      return;
    }
    const id = Number.parseInt(rcIdQuery, 10);
    if (!Number.isFinite(id) || id < 1) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('rcId');
          return next;
        },
        { replace: true },
      );
      return;
    }
    let cancelled = false;
    void rateContractService
      .getById(id)
      .then((api) => {
        if (cancelled) return;
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('rcId');
            return next;
          },
          { replace: true },
        );
        const detail = api.data;
        if (!detail) {
          setPageToast({
            variant: 'error',
            text: 'Rate contract not found.',
          });
          return;
        }
        if (String(detail.status ?? '').toUpperCase() !== RcStatus.APPROVED) {
          setPageToast({
            variant: 'error',
            text:
              'Only an approved rate contract can be used to create a GRN.',
          });
          return;
        }
        const label = detail.rc_number?.trim() || `RC #${id}`;
        setCreatePrefill(grnCreatePrefillFromApprovedRc(detail));
        setCreateSourceRcId(id);
        setCreateSourcePoId(null);
        setCreatePrefillFromPo(false);
        setCreatePrefillLabel(label);
        setCreateFormKey((k) => k + 1);
        setIsFormModalOpen(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setPageToast({
            variant: 'error',
            text: readApiErrorMessage(err, 'Could not load rate contract.'),
          });
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.delete('rcId');
              return next;
            },
            { replace: true },
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [rcIdQuery, isPoGrnRoute, setSearchParams]);

  const poIdQuery = searchParams.get('poId');
  useEffect(() => {
    if (!poIdQuery) return;
    if (!isPoGrnRoute) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('poId');
          return next;
        },
        { replace: true },
      );
      return;
    }
    const id = Number.parseInt(poIdQuery, 10);
    if (!Number.isFinite(id) || id < 1) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('poId');
          return next;
        },
        { replace: true },
      );
      return;
    }
    let cancelled = false;
    void purchaseOrderService
      .getById(id)
      .then((api) => {
        if (cancelled) return;
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('poId');
            return next;
          },
          { replace: true },
        );
        const detail = api.data;
        if (!detail) {
          setPageToast({
            variant: 'error',
            text: 'Purchase order not found.',
          });
          return;
        }
        if (String(detail.status ?? '').toUpperCase() !== RcStatus.APPROVED) {
          setPageToast({
            variant: 'error',
            text:
              'Only an approved purchase order can be used to create a GRN.',
          });
          return;
        }
        const label = detail.po_number?.trim() || `PO #${id}`;
        setCreatePrefill(grnCreatePrefillFromApprovedPo(detail));
        setCreateSourcePoId(id);
        setCreateSourceRcId(null);
        setCreatePrefillFromPo(true);
        setCreatePrefillLabel(label);
        setCreateFormKey((k) => k + 1);
        setIsFormModalOpen(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setPageToast({
            variant: 'error',
            text: readApiErrorMessage(err, 'Could not load purchase order.'),
          });
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.delete('poId');
              return next;
            },
            { replace: true },
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [poIdQuery, isPoGrnRoute, setSearchParams]);

  useEffect(() => {
    if (pageToast == null) return;
    if (pageToast.variant === 'success') {
      message.success(pageToast.text);
    } else {
      message.error(pageToast.text);
    }
    setPageToast(null);
  }, [pageToast]);

  const refreshStatusCounts = useCallback(() => {
    grnService
      .getStatusCounts({ source: grnListSource })
      .then((res) => {
        if (res?.data) setStatusCounts(res.data);
      })
      .catch(() => {});
  }, [grnListSource]);

  const loadList = useCallback(() => {
    const data: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      if (key === 'rcId' || key === 'poId') return;
      data[key] = value;
    });
    if (!data.take) data.take = DEFAULT_TAKE;
    if (!data.skip) data.skip = 0;
    if (String(data.status ?? '').toUpperCase() === RcStatus.PENDING) {
      data.status = RcStatus.SUBMITTED;
    }
    data.source = grnListSource;

    setLoading(true);
    grnService
      .search(data)
      .then((res) => {
        setRows(res.data.rows ?? []);
        setMeta(res.data.meta ?? null);
      })
      .catch(() => {
        setPageToast({
          variant: 'error',
          text: 'Could not load GRNs.',
        });
        setRows([]);
        setMeta(null);
      })
      .finally(() => setLoading(false));
  }, [searchParams, grnListSource]);

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
      if (u === RcStatus.SUBMITTED) {
        sp.set('status', RcStatus.PENDING);
        fix = true;
      } else if (!RC_LIST_TAB_STATUSES.includes(u as RcListTabStatus)) {
        sp.delete('status');
        fix = true;
      }
    }
    if (fix) {
      setSearchParams(sp, { replace: true });
      return;
    }
    loadList();
  }, [searchParams, setSearchParams, loadList]);

  useEffect(() => {
    refreshStatusCounts();
  }, [refreshStatusCounts]);

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

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewRecord(null);
    setViewLoading(false);
    setViewLoadError(null);
    setViewModalId(null);
    setApprovalRemarks('');
  };

  const loadViewRecord = (id: number, options?: { clearRecord?: boolean }) => {
    const clearRecord = options?.clearRecord !== false;
    if (clearRecord) setViewRecord(null);
    setViewLoadError(null);
    setViewLoading(true);
    grnService
      .getById(id)
      .then((res) => {
        if (!res?.data) {
          const text = 'Could not load GRN.';
          setViewLoadError(text);
          setPageToast({ variant: 'error', text });
          return;
        }
        try {
          setViewRecord(grnDetailToRcRecordShape(res.data));
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : 'Invalid GRN data.';
          setViewLoadError(msg);
          setPageToast({ variant: 'error', text: msg });
        }
      })
      .catch((err: unknown) => {
        const text = readApiErrorMessage(err, 'Could not load GRN.');
        setViewLoadError(text);
        setPageToast({ variant: 'error', text });
      })
      .finally(() => setViewLoading(false));
  };

  const openViewRateContract = (id: number) => {
    setIsViewModalOpen(true);
    setViewModalId(id);
    setViewLoadError(null);
    loadViewRecord(id, { clearRecord: true });
  };

  const jwtClaims = readJwtSubAndEmail();
  const myUserId =
    typeof auth.profile.data?.id === 'number'
      ? auth.profile.data.id
      : jwtClaims.sub;
  const myEmail = auth.profile.data?.email ?? jwtClaims.email;

  const pendingApprovalStep = viewRecord?.approval_steps?.find(
    (s) => s.status === PurchaseRequestApprovalStepStatus.PENDING,
  );
  const rcAwaitingApproval =
    String(viewRecord?.status ?? '').toUpperCase() === RcStatus.SUBMITTED;
  const canRecordApprovalDecision =
    !!viewRecord?.id &&
    !!pendingApprovalStep &&
    rcAwaitingApproval &&
    (typeof myUserId === 'number' || Boolean(myEmail)) &&
    userMatchesApprovalAssignee(
      pendingApprovalStep.assignees ?? [],
      myUserId,
      myEmail,
    );

  const submitRcApprovalDecision = async (
    decision: PurchaseRequestApprovalDecision,
  ) => {
    if (!viewRecord?.id) return;
    setApprovalDecisionLoading(true);
    try {
      const res = await grnService.approvalDecision(viewRecord.id, {
        decision,
        remarks: approvalRemarks.trim() || null,
      });
      setPageToast({
        variant: 'success',
        text: res.message ?? 'Decision recorded.',
      });
      setApprovalRemarks('');
      loadViewRecord(viewRecord.id, { clearRecord: false });
      refreshStatusCounts();
      loadList();
    } catch (err) {
      setPageToast({
        variant: 'error',
        text: readApiErrorMessage(err, 'Could not record decision.'),
      });
    } finally {
      setApprovalDecisionLoading(false);
    }
  };

  const totalCount = meta?.itemCount ?? 0;

  const openCreateModal = () => {
    setCreatePrefill(null);
    setCreateSourceRcId(null);
    setCreateSourcePoId(null);
    setCreatePrefillFromPo(false);
    setCreatePrefillLabel(null);
    setCreateFormKey((k) => k + 1);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setCreatePrefill(null);
    setCreateSourceRcId(null);
    setCreateSourcePoId(null);
    setCreatePrefillFromPo(false);
    setCreatePrefillLabel(null);
  };

  const handleFormSubmit = async (values: IRateContractRecord) => {
    const payload: IGrnPayload = {
      grn_number: values.rc_number || undefined,
      rate_contract_id: createSourceRcId ?? undefined,
      purchase_order_id: createSourcePoId ?? undefined,
      invoice_no: values.invoice_no?.trim() || null,
      invoice_date: values.invoice_date?.trim() || null,
      entity_id: values.entity_id ?? null,
      vendor_id: values.vendor_id ?? null,
      vendor_site_id: values.vendor_site_id ?? null,
      shipping_vendor_site_id: values.shipping_vendor_site_id ?? null,
      billing_vendor_site_id: values.billing_vendor_site_id ?? null,
      shipping_address: values.shipping_address ?? null,
      billing_address: values.billing_address ?? null,
      currency_id: values.currency_id ?? null,
      item_type_id: values.item_type_id ?? null,
      validity_from: values.validity_from || null,
      validity_to: values.validity_to || null,
      required_date: values.required_date || null,
      frequency: values.frequency || null,
      department_id: values.department_id ?? null,
      subdepartment_id: values.subdepartment_id ?? null,
      payment_term_id: values.payment_term_id ?? null,
      terms_condition_id: values.terms_condition_id ?? null,
      overall_summary: values.overall_summary || null,
      net_amount: values.net_amount,
      status: RcStatus.SUBMITTED,
      items: values.items.map((i) => ({
        item_id: i.item_id!,
        description: i.description.trim() || null,
        center_id: i.center_id!,
        quantity: i.quantity,
        rate: i.rate,
        gst_id: i.gst_id != null && i.gst_id > 0 ? i.gst_id : null,
        remarks: i.remarks.trim(),
      })),
    };

    setSubmitting(true);
    try {
      const res = await grnService.create(payload);
      setPageToast({
        variant: 'success',
        text: res.message ?? 'GRN submitted.',
      });
      closeFormModal();
      refreshStatusCounts();
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('status', RcStatus.PENDING);
      sp.set('skip', '0');
      if (!sp.has('take')) sp.set('take', String(take));
      setSearchParams(sp);
    } catch (err) {
      setPageToast({
        variant: 'error',
        text: readApiErrorMessage(err, 'Could not create GRN.'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const setStatusTab = (status: '' | RcListTabStatus) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (status === '') sp.delete('status');
    else sp.set('status', status);
    sp.set('skip', '0');
    setSearchParams(sp);
  };

  const STATUS_TABS: {
    key: '' | RcListTabStatus;
    label: string;
    countKey: keyof IGrnStatusCounts;
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
      key: RcStatus.PENDING,
      label: 'Pending',
      countKey: 'PENDING',
      text: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-600',
      activeRing: 'ring-1 ring-amber-300',
    },
    {
      key: RcStatus.APPROVED,
      label: 'Approved',
      countKey: 'APPROVED',
      text: 'text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-600',
      activeRing: 'ring-1 ring-emerald-300',
    },
    {
      key: RcStatus.REJECTED,
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
      if (key === 'rcId' || key === 'poId') return;
      existing[key] = value;
    });
    const merged = { ...existing, ...values };
    const queryString = Object.entries(merged)
      .filter(
        ([key, val]) =>
          val !== undefined &&
          val !== '' &&
          val !== null &&
          key !== 'skip' &&
          key !== 'rcId' &&
          key !== 'poId',
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
      skeletonWidth?: string;
    }[]
  >(
    () => [
      { label: 'GRN #' },
      { label: 'Vendor' },
      { label: 'Department' },
      { label: 'Required' },
      { label: 'Net amount', align: 'right' },
      { label: 'Status' },
      {
        label: 'Workflow step',
        skeletonWidth: 'w-40',
      },
      { label: 'Updated' },
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
              {grnPageTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
              {grnPageSubtitle} {totalCount}{' '}
              {totalCount === 1 ? 'record' : 'records'}.
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
                    className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium tracking-wide transition hover:border-gray-200 ${tab.text} ${isActive ? tab.activeRing : ''}`}
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

            {!isPoGrnRoute && (
              <Can
                I={Common.Actions.CAN_ADD}
                a={Common.Modules.PROCUREMENT.GRN}
              >
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
                >
                  <Plus size={14} /> New GRN
                </button>
              </Can>
            )}
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
                      className={`${pad} py-3 ${alignClass} ${isActions ? 'w-[1%] whitespace-nowrap' : ''} text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200`}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 && (
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
                const status = String(row.status ?? RcStatus.DRAFT);
                const badgeClass = statusBadgeClass(status);
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
                        {row.grn_number ?? '—'}
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
                        {formatStatusLabel(status)}
                      </span>
                    </td>
                    <td className="max-w-[220px] px-4 py-4 border-b border-slate-100/80 text-xs text-gray-600 leading-snug">
                      <RcWorkflowStepCell
                        rcId={row.id}
                        progress={row.approval_progress}
                      />
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80 text-sm text-gray-600">
                      {formatDate(row.updated_date ?? row.created_date)}
                    </td>
                    <td className="w-[1%] whitespace-nowrap px-2 py-4 text-center border-b border-slate-100/80 align-middle">
                      <Can
                        I={Common.Actions.CAN_VIEW}
                        a={Common.Modules.PROCUREMENT.GRN}
                      >
                        <button
                          type="button"
                          onClick={() => openViewRateContract(row.id)}
                          className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-200/90 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200 transition"
                          aria-label={`View GRN ${row.grn_number ?? row.id}`}
                        >
                          <Eye size={16} strokeWidth={2} />
                        </button>
                      </Can>
                    </td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart size={28} className="text-gray-300" />
                      <p>No GRNs found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new GRN.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination meta={meta ?? undefined} defaultPageSize={DEFAULT_TAKE} />
      </div>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter GRNs"
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
              Apply filters
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
                GRN # / Vendor
              </span>
            }
          >
            <Input
              placeholder="Enter RC number or vendor name"
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

      <FormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        size="xl"
        title="New GRN"
        subtitle={
          createPrefillLabel
            ? createPrefillFromPo
              ? `Prefilled from approved purchase order ${createPrefillLabel}. Adjust quantities or lines before submitting.`
              : `Prefilled from approved rate contract ${createPrefillLabel}. Adjust quantities or lines before submitting.`
            : 'Create a GRN with line items and supporting details.'
        }
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => submitBtnRef.current?.click()}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              )}
              Submit for approval
            </button>
          </div>
        }
      >
        <RateContractAdd
          key={createFormKey}
          formVariant="grn"
          data={createPrefill ?? undefined}
          onSubmit={handleFormSubmit}
          myRef={submitBtnRef}
          vendors={fk.vendors}
          entities={fk.entities}
          itemTypes={fk.itemTypes}
          departments={fk.departments}
          subdepartments={fk.subdepartments}
          paymentTerms={fk.paymentTerms}
          centers={fk.centers}
          items={fk.items}
          termsConditions={fk.termsConditions}
          currencies={fk.currencies}
          gstRates={fk.gstRates}
        />
      </FormModal>

      <FormModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        size="xl"
        title="GRN"
        subtitle={
          viewRecord?.rc_number
            ? `GRN ${viewRecord.rc_number}`
            : 'View GRN details'
        }
        footer={
          <div className="flex items-center justify-end gap-3 flex-wrap">
            <Can
              I={Common.Actions.CAN_ADD}
              a={Common.Modules.PROCUREMENT.GRN_INVOICE}
            >
              {String(viewRecord?.status ?? '').toUpperCase() !==
              RcStatus.APPROVED ? (
                <Tooltip title="Create Invoice is available only after the GRN is approved.">
                  <span className="inline-block">
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200"
                    >
                      Create Invoice
                    </button>
                  </span>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!viewRecord?.id) return;
                    navigate(
                      `/rate-contract/grn/invoice?grnId=${viewRecord.id}`,
                    );
                    closeViewModal();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  Create Invoice
                </button>
              )}
            </Can>
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
        {!viewLoading && viewLoadError && !viewRecord && (
          <div className="flex flex-col items-center gap-4 py-16 px-4 text-center">
            <p className="text-sm text-red-600 max-w-md">{viewLoadError}</p>
            {viewModalId != null && (
              <button
                type="button"
                onClick={() => loadViewRecord(viewModalId, { clearRecord: true })}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {!viewLoading && viewRecord && (
          <div className="space-y-8">
            <RateContractAdd
              readOnly
              formVariant="grn"
              data={viewRecord}
              onSubmit={() => {}}
              vendors={fk.vendors}
              entities={fk.entities}
              itemTypes={fk.itemTypes}
              departments={fk.departments}
              subdepartments={fk.subdepartments}
              paymentTerms={fk.paymentTerms}
              centers={fk.centers}
              items={fk.items}
              termsConditions={fk.termsConditions}
              currencies={fk.currencies}
              gstRates={fk.gstRates}
            />

            {rcAwaitingApproval &&
              (!viewRecord.approval_steps ||
                viewRecord.approval_steps.length === 0) && (
                <div className={RC_SECTION_DIVIDER}>
                  <p className={RC_SECTION_TITLE}>Approval</p>
                  <div className="rounded-2xl border border-gray-200/90 bg-white px-4 py-3.5 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100/80">
                    <p className="text-xs text-gray-600 leading-relaxed m-0">
                      No approval queue is stored for this contract yet. Ensure an
                      approval workflow exists for{' '}
                      <span className="font-medium">GRN</span> for the
                      entity and sub-department, then submit again.
                    </p>
                  </div>
                </div>
              )}

            {viewRecord.approval_steps &&
              viewRecord.approval_steps.length > 0 && (
                <div className={RC_SECTION_DIVIDER}>
                  <p className={RC_SECTION_TITLE}>Approval trail</p>
                  <ol className="relative space-y-3 pl-1">
                    {viewRecord.approval_steps.map((step, idx) => {
                      const roleLabel =
                        step.step_role === 'APPROVER' ? 'Approver' : 'Reviewer';
                      const statusLabel =
                        step.status === PurchaseRequestApprovalStepStatus.PENDING
                          ? 'Pending'
                          : step.status ===
                              PurchaseRequestApprovalStepStatus.APPROVED
                            ? 'Approved'
                            : 'Rejected';
                      const names = step.assignees
                        .map((a) =>
                          a.user
                            ? `${a.user.first_name} ${a.user.last_name}`.trim()
                            : `User #${a.user_id}`,
                        )
                        .join(', ');
                      const isLast =
                        idx === viewRecord.approval_steps!.length - 1;
                      return (
                        <li key={step.id} className="relative flex gap-3">
                          <div
                            className="flex flex-col items-center flex-shrink-0 w-5"
                            aria-hidden
                          >
                            <span
                              className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                                step.step_role === 'APPROVER'
                                  ? 'bg-emerald-500 ring-2 ring-emerald-100'
                                  : 'bg-amber-500 ring-2 ring-amber-100'
                              }`}
                            />
                            {!isLast && (
                              <span className="w-px flex-1 min-h-[12px] mt-1 bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 rounded-2xl border border-gray-200/90 bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100/80">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  Step {step.sequence_order}: {roleLabel}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Assigned:{' '}
                                  <span className="text-gray-700">
                                    {names || '—'}
                                  </span>
                                </p>
                              </div>
                              <span
                                className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${approvalStepStatusBadgeClass(step.status)}`}
                              >
                                {statusLabel}
                              </span>
                            </div>
                            {step.acted_by_user ? (
                              <p className="mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-500">
                                {step.status ===
                                PurchaseRequestApprovalStepStatus.APPROVED
                                  ? 'Approved'
                                  : 'Decided'}{' '}
                                by {step.acted_by_user.first_name}{' '}
                                {step.acted_by_user.last_name}
                                {step.acted_at
                                  ? ` · ${formatDate(step.acted_at)}`
                                  : ''}
                                {step.remarks ? ` · ${step.remarks}` : ''}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {canRecordApprovalDecision ? (
                    <div className="mt-6 rounded-2xl border border-gray-200/90 border-l-4 border-l-emerald-500 bg-white p-5 shadow-sm ring-1 ring-gray-100/80">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Your action
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {pendingApprovalStep?.step_role === 'REVIEWER'
                          ? 'You are assigned as the reviewer for this step. Approve to move the contract to the next step, or reject to stop the workflow.'
                          : 'You are assigned as the final approver. Approve to complete the contract, or reject to stop it.'}
                      </p>
                      <TextArea
                        value={approvalRemarks}
                        onChange={(e) => setApprovalRemarks(e.target.value)}
                        placeholder="Optional remarks"
                        rows={3}
                        className="rounded-xl soft-input !py-2.5"
                      />
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={approvalDecisionLoading}
                          onClick={() =>
                            submitRcApprovalDecision(
                              PurchaseRequestApprovalDecision.APPROVE,
                            )
                          }
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {pendingApprovalStep?.step_role === 'REVIEWER'
                            ? 'Approve review'
                            : 'Approve'}
                        </button>
                        <button
                          type="button"
                          disabled={approvalDecisionLoading}
                          onClick={() =>
                            submitRcApprovalDecision(
                              PurchaseRequestApprovalDecision.REJECT,
                            )
                          }
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-700 bg-white border border-red-200 hover:bg-red-50 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {pendingApprovalStep?.step_role === 'REVIEWER'
                            ? 'Reject review'
                            : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default GrnPage;
