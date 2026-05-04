import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, message, Popover } from 'antd';
import {
  Eye,
  Filter,
  ListChecks,
  Loader2,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Can } from '@/ability/can';
import { Common } from '@/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';
import {
  createNewPurchaseRequest,
  searchPurchaseRequestData,
  submitPurchaseRequestApprovalDecision,
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
  type IPurchaseRequestApprovalProgress,
  type IPurchaseRequestApprovalStepRow,
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

/** Workflow step status — aligned with table status pills. */
const approvalStepStatusBadgeClass = (raw: string | null | undefined): string => {
  const u = String(raw ?? '').toUpperCase();
  if (u === 'PENDING') {
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80';
  }
  if (u === 'APPROVED') {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80';
  }
  if (u === 'REJECTED') {
    return 'bg-red-50 text-red-600 ring-1 ring-red-200/80';
  }
  return 'bg-slate-50 text-slate-600 ring-1 ring-slate-200';
};

/** Same section rhythm as `PurchaseRequest/Add`. */
const PR_SECTION_TITLE =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-600 uppercase mb-4';
const PR_SECTION_DIVIDER = 'border-t border-gray-200 pt-6 mt-2';

/** User-facing label in the table (never show "Submitted"). */
const formatStatusLabel = (raw: string | null | undefined): string => {
  const u = String(raw ?? '').toUpperCase();
  if (u === 'SUBMITTED' || u === 'PENDING') return 'PENDING';
  return u || '—';
};

/** List column: where the PR sits in the approval chain. */


const workflowRoleLabel = (role: string): string =>
  String(role).toUpperCase() === 'APPROVER' ? 'Final approver' : 'Reviewer';

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

/** Popover body: `approval_steps` from GET /purchase-request/:id */
function ApprovalWorkflowStepsApiBody({
  prStatus,
  steps,
}: {
  prStatus: string;
  steps: IPurchaseRequestApprovalStepRow[];
}) {
  const st = String(prStatus ?? '').toUpperCase();
  const firstPending = steps.find(
    (s) => String(s.status).toUpperCase() === 'PENDING',
  );
  const pendingList = steps.filter(
    (s) => String(s.status).toUpperCase() === 'PENDING',
  );
  const rejectedAt = steps.find(
    (s) => String(s.status).toUpperCase() === 'REJECTED',
  )?.sequence_order;

  return (
    <div className="w-[min(100vw-2rem,320px)] sm:w-[320px] max-h-[min(70vh,440px)] overflow-y-auto">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-500 uppercase m-0 mb-2">
        Approval trail
      </p>
      <ol className="relative space-y-2 m-0 mb-3 p-0 list-none pl-1">
        {steps.map((step, idx) => {
          const su = String(step.status).toUpperCase();
          const isCurrent =
            (st === 'SUBMITTED' || st === 'PENDING') &&
            !!firstPending &&
            firstPending.sequence_order === step.sequence_order &&
            su === 'PENDING';
          const names = (step.assignees ?? [])
            .map((a) =>
              a.user
                ? `${a.user.first_name} ${a.user.last_name}`.trim()
                : `User #${a.user_id}`,
            )
            .join(', ');
          const isLast = idx === steps.length - 1;
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
                      {workflowRoleLabel(step.step_role)}
                    </p>
                    {names ? (
                      <p className="text-[11px] text-gray-500 mt-0.5 m-0">
                        <span className="text-gray-600">Assigned:</span>{' '}
                        <span className="text-gray-700">{names}</span>
                      </p>
                    ) : null}
                    {isCurrent && (
                      <span className="mt-1 inline-block text-[10px] font-semibold uppercase text-emerald-800">
                        Current step
                      </span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${approvalStepStatusBadgeClass(su)}`}
                  >
                    {su}
                  </span>
                </div>
                {step.acted_by_user && (
                  <p className="mt-1.5 pt-1.5 border-t border-gray-200/80 text-[11px] text-gray-500 m-0">
                    {step.status === 'APPROVED' ? 'Approved' : 'Decided'} by{' '}
                    {step.acted_by_user.first_name} {step.acted_by_user.last_name}
                    {step.acted_at ? ` · ${formatDate(step.acted_at)}` : ''}
                    {step.remarks ? ` · ${step.remarks}` : ''}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="border-t border-gray-200 pt-2.5 space-y-1.5 text-xs text-gray-600">
        {st === 'APPROVED' && (
          <p className="m-0">
            <span className="font-semibold text-gray-800">Done.</span> Every step
            is approved.
          </p>
        )}
        {st === 'REJECTED' && (
          <p className="m-0">
            <span className="font-semibold text-gray-800">Stopped.</span>{' '}
            {rejectedAt != null
              ? `Rejection recorded at step ${rejectedAt}.`
              : 'This request was rejected.'}
          </p>
        )}
        {(st === 'SUBMITTED' || st === 'PENDING') && firstPending && (
          <>
            <p className="m-0">
              <span className="font-semibold text-gray-800">You are here:</span>{' '}
              Step {firstPending.sequence_order} —{' '}
              {workflowRoleLabel(firstPending.step_role)}.
            </p>
            {pendingList.length > 1 ? (
              <p className="m-0">
                <span className="font-semibold text-gray-800">
                  Still to finish:
                </span>{' '}
                {pendingList.length - 1} more step
                {pendingList.length - 1 === 1 ? '' : 's'} (
                {pendingList
                  .slice(1)
                  .map(
                    (x) =>
                      `step ${x.sequence_order} (${workflowRoleLabel(x.step_role)})`,
                  )
                  .join(', ')}
                ).
              </p>
            ) : (
              (() => {
                const afterCurrent = steps.filter(
                  (x) => x.sequence_order > firstPending.sequence_order,
                );
                if (afterCurrent.length === 0) {
                  return (
                    <p className="m-0 text-emerald-900/90">
                      <span className="font-semibold text-gray-800">
                        Last step in the chain.
                      </span>{' '}
                      No further reviewers after this.
                    </p>
                  );
                }
                return (
                  <p className="m-0">
                    <span className="font-semibold text-gray-800">
                      Steps left after this:
                    </span>{' '}
                    {afterCurrent.length} (
                    {afterCurrent
                      .map(
                        (x) =>
                          `step ${x.sequence_order} (${workflowRoleLabel(x.step_role)})`,
                      )
                      .join(', ')}
                    ).
                  </p>
                );
              })()
            )}
          </>
        )}
        {(st === 'SUBMITTED' || st === 'PENDING') && !firstPending && (
          <p className="m-0 text-gray-500">
            No pending step (workflow may already be complete for this row).
          </p>
        )}
        {st === 'DRAFT' && (
          <p className="m-0 text-gray-500">
            Draft — the chain starts after submit.
          </p>
        )}
      </div>
    </div>
  );
}

function WorkflowStepCell({
  prId,
  status,
  progress,
}: {
  prId: number;
  status: string;
  progress: IPurchaseRequestApprovalProgress | null | undefined;
}) {
  const listSteps = progress?.steps;
  const hasStepTrail =
    (Array.isArray(listSteps) && listSteps.length > 0) ||
    (progress != null && Number(progress.total_steps) >= 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSteps, setFetchedSteps] = useState<
    IPurchaseRequestApprovalStepRow[] | null
  >(null);
  const [fetchedStatus, setFetchedStatus] = useState<string | null>(null);
  const fetchDismissedRef = useRef(false);

  if (!hasStepTrail) {
    return (
      <span className="line-clamp-2" title={label}>
        {label}
      </span>
    );
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
    <ApprovalWorkflowStepsApiBody
      prStatus={fetchedStatus ?? status}
      steps={fetchedSteps}
    />
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
            setFetchedStatus(null);
            void purchaseRequestService
              .getApprovalTrail(prId)
              .then((res) => {
                if (fetchDismissedRef.current) return;
                if (!res?.data) {
                  setError('Could not load workflow.');
                  setFetchedSteps([]);
                  return;
                }
                setFetchedSteps(res.data.approval_steps ?? []);
                setFetchedStatus(String(res.data.status ?? status));
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
            setFetchedStatus(null);
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

const { TextArea } = Input;

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
    const payload = JSON.parse(raw) as { sub?: number | string; email?: string };
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

export const PurchaseRequestPage = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(purchaseRequestSelector);
  const auth = useAppSelector(authSelector);
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
  const [viewLoadError, setViewLoadError] = useState<string | null>(null);
  const [viewModalPrId, setViewModalPrId] = useState<number | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
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
    setViewLoadError(null);
    setViewModalPrId(null);
    setApprovalRemarks('');
  };

  const loadViewRecord = (id: number, options?: { clearRecord?: boolean }) => {
    const clearRecord = options?.clearRecord !== false;
    if (clearRecord) setViewRecord(null);
    setViewLoadError(null);
    setViewLoading(true);
    purchaseRequestService
      .getById(id)
      .then((res) => {
        if (!res?.data) {
          setViewLoadError('Could not load purchase request.');
          message.error('Could not load purchase request.');
          return;
        }
        try {
          setViewRecord(buildRecordFromRow(res.data));
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : 'Invalid purchase request data.';
          setViewLoadError(msg);
          message.error(msg);
        }
      })
      .catch((err: unknown) => {
        const text =
          err instanceof Error ? err.message : 'Could not load purchase request.';
        setViewLoadError(text);
        message.error(text);
      })
      .finally(() => setViewLoading(false));
  };

  const openViewPurchaseRequest = (id: number) => {
    setIsViewModalOpen(true);
    setViewModalPrId(id);
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
    (s) => s.status === 'PENDING',
  );
  const prAwaitingApproval =
    String(viewRecord?.status ?? '').toUpperCase() === 'SUBMITTED';
  const canRecordApprovalDecision =
    !!viewRecord?.id &&
    !!pendingApprovalStep &&
    prAwaitingApproval &&
    (typeof myUserId === 'number' || Boolean(myEmail)) &&
    userMatchesApprovalAssignee(
      pendingApprovalStep.assignees ?? [],
      myUserId,
      myEmail,
    );

  const submitApprovalDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (!viewRecord?.id) return;
    const result = await dispatch(
      submitPurchaseRequestApprovalDecision({
        id: viewRecord.id,
        decision,
        remarks: approvalRemarks.trim() || null,
      }),
    );
    if (result.meta.requestStatus === 'fulfilled') {
      setApprovalRemarks('');
      loadViewRecord(viewRecord.id, { clearRecord: false });
    }
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
      else {
        message.success(state.create.message);
        refreshStatusCounts();
      }
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.create.message]);

  useEffect(() => {
    if (state.approvalDecision.message) {
      if (state.approvalDecision.hasErrors) {
        message.error(state.approvalDecision.message);
      } else {
        message.success(state.approvalDecision.message);
        refreshStatusCounts();
      }
      dispatch(clearPurchaseRequestMessage());
    }
  }, [state.approvalDecision.message]);

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
      {
        label: 'Workflow step',
        skeletonWidth: 'w-40',
      },
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
                    <td className="max-w-[220px] px-4 py-4 border-b border-slate-100/80 text-xs text-gray-600 leading-snug">
                      <WorkflowStepCell
                        prId={row.id}
                        status={String(status)}
                        progress={row.approval_progress}
                      />
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
        {!viewLoading && viewLoadError && !viewRecord && (
          <div className="flex flex-col items-center gap-4 py-16 px-4 text-center">
            <p className="text-sm text-red-600 max-w-md">{viewLoadError}</p>
            {viewModalPrId != null && (
              <button
                type="button"
                onClick={() => loadViewRecord(viewModalPrId, { clearRecord: true })}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {!viewLoading && viewRecord && (
          <div className="space-y-8">
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

            {prAwaitingApproval &&
              (!viewRecord.approval_steps ||
                viewRecord.approval_steps.length === 0) && (
                <div className={PR_SECTION_DIVIDER}>
                  <p className={PR_SECTION_TITLE}>Approval</p>
                  <div className="rounded-2xl border border-gray-200/90 bg-white px-4 py-3.5 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100/80">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      No approval queue is stored for this request. It may have
                      been created before workflow enforcement, or the database
                      migration for approval steps may not be applied. New
                      submissions after setup should show steps here.
                    </p>
                  </div>
                </div>
              )}

            {viewRecord.approval_steps &&
              viewRecord.approval_steps.length > 0 && (
                <div className={PR_SECTION_DIVIDER}>
                  <p className={PR_SECTION_TITLE}>Approval trail</p>
                  <ol className="relative space-y-3 pl-1">
                    {viewRecord.approval_steps.map((step, idx) => {
                      const roleLabel =
                        step.step_role === 'APPROVER'
                          ? 'Approver'
                          : 'Reviewer';
                      const statusLabel =
                        step.status === 'PENDING'
                          ? 'Pending'
                          : step.status === 'APPROVED'
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
                            {step.acted_by_user && (
                              <p className="mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-500">
                                {step.status === 'APPROVED'
                                  ? 'Approved'
                                  : 'Decided'}{' '}
                                by {step.acted_by_user.first_name}{' '}
                                {step.acted_by_user.last_name}
                                {step.acted_at
                                  ? ` · ${formatDate(step.acted_at)}`
                                  : ''}
                                {step.remarks ? ` · ${step.remarks}` : ''}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {canRecordApprovalDecision && (
                    <div className="mt-6 rounded-2xl border border-gray-200/90 border-l-4 border-l-emerald-500 bg-white p-5 shadow-sm ring-1 ring-gray-100/80">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Your action
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {pendingApprovalStep?.step_role === 'REVIEWER'
                          ? 'You are assigned as the reviewer for this step. Approve to move the request to the next step, or reject to stop the workflow.'
                          : 'You are assigned as the final approver. Approve to complete the request, or reject to stop it.'}
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
                          disabled={state.approvalDecision.loading}
                          onClick={() => submitApprovalDecision('APPROVE')}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {pendingApprovalStep?.step_role === 'REVIEWER'
                            ? 'Approve review'
                            : 'Approve'}
                        </button>
                        <button
                          type="button"
                          disabled={state.approvalDecision.loading}
                          onClick={() => submitApprovalDecision('REJECT')}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-700 bg-white border border-red-200 hover:bg-red-50 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {pendingApprovalStep?.step_role === 'REVIEWER'
                            ? 'Reject review'
                            : 'Reject'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default PurchaseRequestPage;
