import { useEffect, useMemo, useRef, useState } from 'react';
import { InputNumber, message } from 'antd';
import { ArrowRight, Plus, Trash2, Workflow, X } from 'lucide-react';
import { EmptyStatePlaceholder } from '@/components/ui/EmptyStatePlaceholder';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Select } from '@/components/ui/Select';
import userService from '@/services/user/user.service';
import type { IUserDetails } from '@/services/user/user.model';
import type { SelectOption } from '@/common/models';
import entityService from '@/services/entity/entity.service';
import subdepartmentService from '@/services/subdepartment/subdepartment.service';
import centerService from '@/services/center/center.service';
import approvalWorkflowService from '@/services/approvalWorkflow/approvalWorkflow.service';
import type { IApprovalWorkflowLimit } from '@/services/approvalWorkflow/approvalWorkflow.model';
import type { ISubdepartmentOption } from '@/pages/PurchaseRequest/Add/Add.model';
import {
  ApprovalWorkflowStepRole,
  ApprovalWorkflowTransactionType,
  TRANSACTION_TYPE_OPTIONS,
} from '@/common/enums';

/** `center_id` empty string = all centers (default). */
const CENTER_ALL_VALUE = '';

interface IFlowStep {
  id: string;
  role: ApprovalWorkflowStepRole;
  user_ids: string[];
}

interface ILimitTier {
  id: string;
  min: number;
  max: number | null;
  steps: IFlowStep[];
}

interface IWorkflowScope {
  entity_id: string;
  transaction_type: string;
  subdepartment_id: string;
  center_id: string;
}

const emptyScope = (): IWorkflowScope => ({
  entity_id: '',
  transaction_type: '',
  subdepartment_id: '',
  center_id: CENTER_ALL_VALUE,
});

const ROLE_LABEL: Record<ApprovalWorkflowStepRole, string> = {
  [ApprovalWorkflowStepRole.REVIEWER]: 'Reviewer',
  [ApprovalWorkflowStepRole.APPROVER]: 'Approver',
};

const ROLE_DOT: Record<ApprovalWorkflowStepRole, string> = {
  [ApprovalWorkflowStepRole.REVIEWER]: 'bg-amber-500',
  [ApprovalWorkflowStepRole.APPROVER]: 'bg-emerald-500',
};

const SECTION_LABEL =
  'text-[11px] font-semibold tracking-[0.14em] text-gray-500 uppercase';

const ScopeFieldLabel = ({ children }: { children: string }) => (
  <span className={`${SECTION_LABEL} block mb-1.5`}>{children}</span>
);

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const newStep = (
  role: ApprovalWorkflowStepRole = ApprovalWorkflowStepRole.REVIEWER,
): IFlowStep => ({
  id: uid(),
  role,
  user_ids: [],
});

const newTier = (min: number): ILimitTier => ({
  id: uid(),
  min,
  max: null,
  steps: [newStep(ApprovalWorkflowStepRole.REVIEWER)],
});

/** Map API limits to local tier state (stable client ids for React keys). */
const limitsFromApi = (limits: IApprovalWorkflowLimit[]): ILimitTier[] =>
  [...limits]
    .sort((a, b) => a.order - b.order)
    .map((lim) => ({
      id: uid(),
      min: lim.min,
      max: lim.max,
      steps: [...lim.steps]
        .sort((a, b) => a.order - b.order)
        .map((st) => ({
          id: uid(),
          role: st.role,
          user_ids: st.user_ids.map(String),
        })),
    }));

const formatMoney = (value: number | null): string => {
  if (value == null) return '—';
  return value.toLocaleString('en-IN');
};

const tierRange = (tier: ILimitTier): string => {
  const min = `₹ ${formatMoney(tier.min)}`;
  const max = tier.max == null ? 'No limit' : `₹ ${formatMoney(tier.max)}`;
  return `${min} — ${max}`;
};

/** Rules for the current last tier before another tier can be stacked after it. */
const tierReadyForAnotherTier = (t: ILimitTier): boolean => {
  if (t.max == null || t.max <= t.min) return false;
  if (!t.steps.some((s) => s.role === ApprovalWorkflowStepRole.REVIEWER))
    return false;
  if (!t.steps.some((s) => s.role === ApprovalWorkflowStepRole.APPROVER))
    return false;
  if (
    !t.steps
      .filter((s) => s.role === ApprovalWorkflowStepRole.REVIEWER)
      .some((s) => s.user_ids.length > 0)
  )
    return false;
  if (
    !t.steps
      .filter((s) => s.role === ApprovalWorkflowStepRole.APPROVER)
      .some((s) => s.user_ids.length > 0)
  )
    return false;
  return true;
};

export const WorkflowsPage = () => {
  const [tiers, setTiers] = useState<ILimitTier[]>([newTier(0)]);
  const [activeTierId, setActiveTierId] = useState<string>(() => '');
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const fetched = useRef(false);

  const [scope, setScope] = useState<IWorkflowScope>(emptyScope);
  const [entityOptions, setEntityOptions] = useState<SelectOption[]>([]);
  const [subdepartmentOptions, setSubdepartmentOptions] = useState<
    ISubdepartmentOption[]
  >([]);
  const [centerRows, setCenterRows] = useState<SelectOption[]>([]);
  const scopeFetched = useRef(false);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [savingWorkflow, setSavingWorkflow] = useState(false);

  useEffect(() => {
    if (scopeFetched.current) return;
    scopeFetched.current = true;
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'true');
    const p = Object.fromEntries(params);

    entityService
      .searchEntityData(p)
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setEntityOptions(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setEntityOptions([]));

    subdepartmentService
      .searchSubdepartmentData(p)
      .then((res) => {
        const rows =
          ((res.data as unknown) as {
            rows?: { id: number; name: string; department_id: number }[];
          })?.rows ?? [];
        setSubdepartmentOptions(
          rows.map((r) => ({
            value: String(r.id),
            label: r.name,
            department_id: String(r.department_id ?? ''),
          })),
        );
      })
      .catch(() => setSubdepartmentOptions([]));

    centerService
      .searchCenterData(p)
      .then((res) => {
        const rows =
          ((res.data as unknown) as { rows?: { id: number; name: string }[] })
            ?.rows ?? [];
        setCenterRows(rows.map((r) => ({ value: String(r.id), label: r.name })));
      })
      .catch(() => setCenterRows([]));
  }, []);

  const centerSelectOptions = useMemo(
    () => [
      { value: CENTER_ALL_VALUE, label: 'All Centers (Default)' },
      ...centerRows,
    ],
    [centerRows],
  );

  /** Center optional; these three scope fields gate showing tier UI ("no data" until set). */
  const scopeSelected = useMemo(
    () =>
      Boolean(
        scope.entity_id && scope.transaction_type && scope.subdepartment_id,
      ),
    [scope.entity_id, scope.transaction_type, scope.subdepartment_id],
  );

  useEffect(() => {
    if (!scopeSelected) return;
    let cancelled = false;
    setLoadingWorkflow(true);
    const params: {
      entity_id: number;
      transaction_type: ApprovalWorkflowTransactionType;
      subdepartment_id: number;
      center_id?: number;
    } = {
      entity_id: Number(scope.entity_id),
      transaction_type: scope.transaction_type as ApprovalWorkflowTransactionType,
      subdepartment_id: Number(scope.subdepartment_id),
    };
    if (scope.center_id !== CENTER_ALL_VALUE && scope.center_id) {
      params.center_id = Number(scope.center_id);
    }
    approvalWorkflowService
      .getByScope(params)
      .then((res) => {
        if (cancelled) return;
        const row = res.data;
        if (!row?.limits?.length) {
          const fresh = [newTier(0)];
          setTiers(fresh);
          setActiveTierId(fresh[0].id);
        } else {
          const mapped = limitsFromApi(row.limits);
          setTiers(mapped);
          setActiveTierId(mapped[0]?.id ?? '');
        }
      })
      .catch(() => {
        if (cancelled) return;
        message.error('Could not load workflow for this scope.');
        const fresh = [newTier(0)];
        setTiers(fresh);
        setActiveTierId(fresh[0].id);
      })
      .finally(() => {
        if (!cancelled) setLoadingWorkflow(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    scopeSelected,
    scope.entity_id,
    scope.transaction_type,
    scope.subdepartment_id,
    scope.center_id,
  ]);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    setLoadingUsers(true);
    const params = new URLSearchParams();
    params.set('noLimit', 'true');
    params.set('status', 'ENABLE');
    userService
      .searchUserData(params)
      .then((res) => {
        const list = (res.data as { rows?: IUserDetails[] }).rows ?? [];
        setUserOptions(
          list.map((u) => ({
            value: String(u.id),
            label:
              `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email,
          })),
        );
      })
      .catch(() => undefined)
      .finally(() => setLoadingUsers(false));
  }, []);

  // First tier always 0; subsequent tiers' Min auto-locks to (prev.max + 1).
  const displayedTiers = useMemo<ILimitTier[]>(() => {
    let prevMax: number | null = null;
    return tiers.map((tier, idx) => {
      const min = idx === 0 ? 0 : (prevMax ?? tier.min) + 1;
      prevMax = tier.max ?? prevMax;
      return idx === 0 ? tier : { ...tier, min };
    });
  }, [tiers]);

  // Keep an active tier selected as the list mutates.
  useEffect(() => {
    if (displayedTiers.length === 0) return;
    if (!displayedTiers.some((t) => t.id === activeTierId)) {
      setActiveTierId(displayedTiers[0].id);
    }
  }, [displayedTiers, activeTierId]);

  const activeTier = useMemo(
    () =>
      displayedTiers.find((t) => t.id === activeTierId) ??
      displayedTiers[0] ??
      null,
    [displayedTiers, activeTierId],
  );

  /** Last tier must be fully configured (amount + reviewer/approver + users) before another tier can be added. */
  const canAddNextTier = useMemo(() => {
    if (displayedTiers.length === 0) return false;
    const last = displayedTiers[displayedTiers.length - 1];
    return tierReadyForAnotherTier(last);
  }, [displayedTiers]);

  const addTier = () => {
    if (!canAddNextTier) {
      message.warning(
        'Finish the last tier first: set max above min, add reviewer and approver steps, and assign at least one user to each role. Then you can add another tier.',
      );
      return;
    }
    setTiers((prev) => {
      const last = prev[prev.length - 1];
      const nextMin = last?.max != null ? last.max + 1 : 0;
      const tier = newTier(nextMin);
      setActiveTierId(tier.id);
      return [...prev, tier];
    });
  };

  const removeTier = (id: string) => {
    setTiers((prev) =>
      prev.length === 1 ? prev : prev.filter((t) => t.id !== id),
    );
  };

  const updateTier = (id: string, patch: Partial<ILimitTier>) => {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addStep = (
    tierId: string,
    role: ApprovalWorkflowStepRole = ApprovalWorkflowStepRole.REVIEWER,
  ) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId ? { ...t, steps: [...t.steps, newStep(role)] } : t,
      ),
    );
  };

  const removeStep = (tierId: string, stepId: string) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? {
              ...t,
              steps:
                t.steps.length === 1
                  ? t.steps
                  : t.steps.filter((s) => s.id !== stepId),
            }
          : t,
      ),
    );
  };

  const updateStep = (
    tierId: string,
    stepId: string,
    patch: Partial<IFlowStep>,
  ) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? {
              ...t,
              steps: t.steps.map((s) =>
                s.id === stepId ? { ...s, ...patch } : s,
              ),
            }
          : t,
      ),
    );
  };

  const handleSave = async () => {
    if (!scope.entity_id) {
      message.error('Select an entity.');
      return;
    }
    if (!scope.transaction_type) {
      message.error('Select a transaction type.');
      return;
    }
    if (!scope.subdepartment_id) {
      message.error('Select a subdepartment.');
      return;
    }

    for (let i = 0; i < displayedTiers.length; i++) {
      const t = displayedTiers[i];
      const isLast = i === displayedTiers.length - 1;
      if (!isLast) {
        if (t.max == null || t.max <= t.min) {
          message.error(
            `Tier ${i + 1}: set a maximum greater than the minimum (₹ ${t.min.toLocaleString('en-IN')}) before saving.`,
          );
          return;
        }
      } else if (t.max != null && t.max <= t.min) {
        message.error(
          `Tier ${i + 1}: maximum must be greater than the minimum.`,
        );
        return;
      }

      const hasReviewer = t.steps.some(
        (s) => s.role === ApprovalWorkflowStepRole.REVIEWER,
      );
      const hasApprover = t.steps.some(
        (s) => s.role === ApprovalWorkflowStepRole.APPROVER,
      );
      if (!hasReviewer || !hasApprover) {
        const need: string[] = [];
        if (!hasReviewer) need.push('at least one reviewer step');
        if (!hasApprover) need.push('at least one approver step');
        message.error(
          `Tier ${i + 1}: add ${need.join(' and ')} in the approval sequence before saving.`,
        );
        return;
      }

      const reviewerHasUser = t.steps
        .filter((s) => s.role === ApprovalWorkflowStepRole.REVIEWER)
        .some((s) => s.user_ids.length > 0);
      const approverHasUser = t.steps
        .filter((s) => s.role === ApprovalWorkflowStepRole.APPROVER)
        .some((s) => s.user_ids.length > 0);
      if (!reviewerHasUser || !approverHasUser) {
        const need: string[] = [];
        if (!reviewerHasUser) need.push('at least one user on a reviewer step');
        if (!approverHasUser) need.push('at least one user on an approver step');
        message.error(
          `Tier ${i + 1}: assign ${need.join(' and ')} before saving.`,
        );
        return;
      }
    }

    const payload = {
      entity_id: Number(scope.entity_id),
      transaction_type: scope.transaction_type as ApprovalWorkflowTransactionType,
      subdepartment_id: Number(scope.subdepartment_id),
      center_id:
        scope.center_id === CENTER_ALL_VALUE
          ? null
          : Number(scope.center_id),
      limits: displayedTiers.map((t, idx) => ({
        order: idx + 1,
        min: t.min,
        max: t.max,
        steps: t.steps.map((s, sIdx) => ({
          order: sIdx + 1,
          role: s.role,
          user_ids: s.user_ids.map((v) => Number(v)),
        })),
      })),
    };
    setSavingWorkflow(true);
    try {
      await approvalWorkflowService.save(payload);
      message.success('Workflow saved');
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Could not save workflow.');
    } finally {
      setSavingWorkflow(false);
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        {/* Header + scope (dropdowns beside title) */}
        <div className="px-6 py-4 flex-shrink-0 border-b border-gray-100">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 min-w-0 flex-1">
              <div className="shrink-0">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Workflow size={18} className="text-emerald-600" />
                  Approval Workflow
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {scopeSelected ? (
                    <>
                      {displayedTiers.length} tier
                      {displayedTiers.length === 1 ? '' : 's'} configured
                    </>
                  ) : (
                    'Select entity, transaction type, and subdepartment — center is optional'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-3 gap-y-2 flex-1 min-w-0">
                <div className="min-w-0">
                  <ScopeFieldLabel>Entity</ScopeFieldLabel>
                  <Select
                    value={scope.entity_id}
                    onChange={(v) => setScope((s) => ({ ...s, entity_id: v }))}
                    options={entityOptions}
                    placeholder="Select entity"
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <ScopeFieldLabel>Transaction type</ScopeFieldLabel>
                  <Select
                    value={scope.transaction_type}
                    onChange={(v) =>
                      setScope((s) => ({ ...s, transaction_type: v }))
                    }
                    options={TRANSACTION_TYPE_OPTIONS}
                    placeholder="Select transaction type"
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <ScopeFieldLabel>Subdepartment</ScopeFieldLabel>
                  <Select
                    value={scope.subdepartment_id}
                    onChange={(v) =>
                      setScope((s) => ({ ...s, subdepartment_id: v }))
                    }
                    options={subdepartmentOptions}
                    placeholder="Select subdepartment"
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <ScopeFieldLabel>Center</ScopeFieldLabel>
                  <Select
                    value={scope.center_id}
                    onChange={(v) => setScope((s) => ({ ...s, center_id: v }))}
                    options={centerSelectOptions}
                    placeholder="Select center"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!scopeSelected || savingWorkflow || loadingWorkflow}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm shrink-0 self-start xl:self-end disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
            >
              {savingWorkflow ? 'Saving…' : 'Save Workflow'}
            </button>
          </div>
        </div>

        {/* Two-pane body — hidden until scope is chosen */}
        {scopeSelected ? (
        <div className="relative flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-0">
          {loadingWorkflow ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-b-2xl">
              <span className="text-sm text-gray-600 font-medium">
                Loading workflow…
              </span>
            </div>
          ) : null}
          {/* Left: tier list */}
          <aside className="border-r border-gray-100 flex flex-col min-h-0">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-slate-50/50">
              <span className={SECTION_LABEL}>Amount Tiers</span>
              <button
                type="button"
                onClick={addTier}
                disabled={!canAddNextTier}
                title={
                  canAddNextTier
                    ? 'Add another amount tier'
                    : 'Complete the last tier (max, reviewer & approver with users) to add another'
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-emerald-700"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="flex-1 overflow-y-auto soft-scroll">
              {displayedTiers.map((tier, tierIdx) => {
                const isActive = tier.id === activeTier?.id;
                const stepCount = tier.steps.length;
                const userCount = new Set(
                  tier.steps.flatMap((s) => s.user_ids),
                ).size;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setActiveTierId(tier.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 transition flex items-center gap-3 ${
                      isActive
                        ? 'bg-emerald-50/70 border-l-2 border-l-emerald-500'
                        : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tierIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-emerald-900' : 'text-gray-800'
                        }`}
                      >
                        Tier {tierIdx + 1}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {tierRange(tier)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {stepCount} step{stepCount === 1 ? '' : 's'} ·{' '}
                        {userCount} {userCount === 1 ? 'user' : 'users'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right: detail */}
          <section className="flex-1 min-h-0 overflow-y-auto soft-scroll">
            {activeTier ? (
              <TierDetail
                tier={activeTier}
                tierIndex={displayedTiers.findIndex(
                  (t) => t.id === activeTier.id,
                )}
                isLast={
                  displayedTiers[displayedTiers.length - 1]?.id ===
                  activeTier.id
                }
                canRemove={displayedTiers.length > 1}
                userOptions={userOptions}
                loadingUsers={loadingUsers}
                onChangeMax={(v) => updateTier(activeTier.id, { max: v })}
                onRemove={() => removeTier(activeTier.id)}
                onAddStep={(role) => addStep(activeTier.id, role)}
                onRemoveStep={(stepId) => removeStep(activeTier.id, stepId)}
                onUpdateStep={(stepId, patch) =>
                  updateStep(activeTier.id, stepId, patch)
                }
              />
            ) : null}
          </section>
        </div>
        ) : (
          <EmptyStatePlaceholder
            description={
              <>
                Choose <span className="text-gray-700">entity</span>,{' '}
                <span className="text-gray-700">transaction type</span>, and{' '}
                <span className="text-gray-700">subdepartment</span> in the header to
                load this workflow. <span className="text-gray-700">Center</span>{' '}
                defaults to all centers until you pick one.
              </>
            }
          />
        )}
      </div>
    </div>
  );
};

interface ITierDetailProps {
  tier: ILimitTier;
  tierIndex: number;
  isLast: boolean;
  canRemove: boolean;
  userOptions: SelectOption[];
  loadingUsers: boolean;
  onChangeMax: (max: number | null) => void;
  onRemove: () => void;
  onAddStep: (role: ApprovalWorkflowStepRole) => void;
  onRemoveStep: (stepId: string) => void;
  onUpdateStep: (stepId: string, patch: Partial<IFlowStep>) => void;
}

const TierDetail = ({
  tier,
  tierIndex,
  isLast,
  canRemove,
  userOptions,
  loadingUsers,
  onChangeMax,
  onRemove,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
}: ITierDetailProps) => {
  return (
    <div className="flex flex-col min-h-0">
      {/* Tier summary + flow preview — one sticky block */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-[0_1px_0_rgba(16,24,40,0.04)]">
        {/* Row 1: tier + range readout | amount controls | remove */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-5 min-w-0 flex-1">
            <div className="shrink-0">
              <p className={SECTION_LABEL}>Tier {tierIndex + 1}</p>
              <p className="text-base font-semibold text-gray-900 mt-1 tabular-nums tracking-tight">
                {tierRange(tier)}
              </p>
            </div>

            <div
              aria-hidden
              className="hidden sm:block w-px self-stretch min-h-[44px] bg-gray-200 shrink-0"
            />

            <div className="rounded-xl border border-gray-200 bg-slate-50/70 px-3 py-2.5 flex flex-wrap items-end gap-x-3 gap-y-2 min-w-0 flex-1">
              <span className={`${SECTION_LABEL} pb-0.5`}>Amount Range</span>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5 block">
                    Min
                  </label>
                  <InputNumber
                    value={tier.min}
                    disabled
                    size="small"
                    className="!w-[100px] !rounded-lg soft-input !bg-white"
                    formatter={(v) =>
                      v == null ? '' : Number(v).toLocaleString('en-IN')
                    }
                  />
                </div>
                <span className="text-gray-300 pb-2 text-sm">—</span>
                <div>
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5 block">
                    Max
                  </label>
                  <InputNumber
                    value={tier.max ?? undefined}
                    onChange={(v) => onChangeMax(v == null ? null : Number(v))}
                    placeholder={isLast ? 'No limit' : 'Max'}
                    min={tier.min + 1}
                    size="small"
                    className="!w-[116px] !rounded-lg soft-input !bg-white"
                    formatter={(v) =>
                      v == null || `${v}` === ''
                        ? ''
                        : Number(v).toLocaleString('en-IN')
                    }
                    parser={(v) => Number((v ?? '').replace(/[^\d.-]/g, ''))}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            aria-label="Remove tier"
            className="group inline-flex items-center justify-center p-2.5 rounded-full self-start lg:self-center shrink-0 border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/50 focus-visible:ring-offset-2 active:scale-[0.99] disabled:pointer-events-none disabled:border-slate-100 disabled:bg-slate-50/50 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-slate-50/50 disabled:hover:border-slate-100 disabled:hover:text-slate-300"
          >
            <Trash2 size={17} strokeWidth={1.75} className="shrink-0" />
          </button>
        </div>

        {/* Row 2: flow preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className={`${SECTION_LABEL} shrink-0 sm:pt-0.5`}>Flow Preview</p>
            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-slate-50/50 px-3 py-2.5">
              <FlowPreview steps={tier.steps} userOptions={userOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
      {/* Approval flow */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className={SECTION_LABEL}>Approval Sequence</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onAddStep(ApprovalWorkflowStepRole.REVIEWER)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Plus size={12} /> Reviewer
            </button>
            <button
              type="button"
              onClick={() => onAddStep(ApprovalWorkflowStepRole.APPROVER)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Plus size={12} /> Approver
            </button>
          </div>
        </div>

        {tier.steps.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No steps yet.</p>
        ) : (
          <ul className="space-y-2">
            {tier.steps.map((step, stepIdx) => (
              <li key={step.id}>
                <StepRow
                  index={stepIdx + 1}
                  step={step}
                  userOptions={userOptions}
                  loadingUsers={loadingUsers}
                  onChangeRole={(role) => onUpdateStep(step.id, { role })}
                  onChangeUsers={(user_ids) =>
                    onUpdateStep(step.id, { user_ids })
                  }
                  onRemove={() => onRemoveStep(step.id)}
                  canRemove={tier.steps.length > 1}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
};

interface IStepRowProps {
  index: number;
  step: IFlowStep;
  userOptions: SelectOption[];
  loadingUsers: boolean;
  onChangeRole: (role: ApprovalWorkflowStepRole) => void;
  onChangeUsers: (user_ids: string[]) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const StepRow = ({
  index,
  step,
  userOptions,
  loadingUsers,
  onChangeRole,
  onChangeUsers,
  onRemove,
  canRemove,
}: IStepRowProps) => {
  return (
    <div className="grid grid-cols-[28px_150px_1fr_28px] items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
        {index}
      </span>

      <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100">
        {(
          [
            ApprovalWorkflowStepRole.REVIEWER,
            ApprovalWorkflowStepRole.APPROVER,
          ] as const
        ).map((r) => {
          const active = step.role === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => onChangeRole(r)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition ${
                active
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ROLE_DOT[r]}`} />
              {ROLE_LABEL[r]}
            </button>
          );
        })}
      </div>

      <MultiSelect
        values={step.user_ids}
        onChange={onChangeUsers}
        options={userOptions}
        placeholder={loadingUsers ? 'Loading users…' : 'Select users…'}
        size="sm"
        maxChipsShown={3}
      />

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Remove step"
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface IFlowPreviewProps {
  steps: IFlowStep[];
  userOptions: SelectOption[];
}

const FlowPreview = ({ steps, userOptions }: IFlowPreviewProps) => {
  const labelMap = useMemo(
    () => new Map(userOptions.map((o) => [o.value, o.label])),
    [userOptions],
  );

  if (steps.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic">
        Add steps below to preview the flow.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, idx) => {
        const names = step.user_ids
          .map((id) => labelMap.get(id))
          .filter((n): n is string => Boolean(n));
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs text-gray-800 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ROLE_DOT[step.role]}`} />
              <span className="font-medium">{ROLE_LABEL[step.role]}</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-600 truncate max-w-[200px] sm:max-w-[280px]">
                {names.length === 0 ? 'No one assigned' : names.join(', ')}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight size={14} className="text-gray-300 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowsPage;
