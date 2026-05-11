import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { ArrowRight, Plus, Workflow, X } from 'lucide-react';
import { EmptyStatePlaceholder } from '@/components/ui/EmptyStatePlaceholder';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Select } from '@/components/ui/Select';
import userService from '@/services/user/user.service';
import type { IUserDetails } from '@/services/user/user.model';
import type { SelectOption } from '@/common/models';
import approvalWorkflowV2Service from '@/services/approvalWorkflowV2/approvalWorkflowV2.service';
import type { IApprovalWorkflowV2Step } from '@/services/approvalWorkflowV2/approvalWorkflowV2.model';
import {
  APPROVAL_WORKFLOW_V2_SCOPE_OPTIONS,
  ApprovalWorkflowStepRole,
  ApprovalWorkflowV2Scope,
} from '@/common/enums';

interface IFlowStep {
  /** Stable client-side id for React keys. */
  id: string;
  role: ApprovalWorkflowStepRole;
  user_ids: string[];
}

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

const SCOPE_DESCRIPTION: Record<ApprovalWorkflowV2Scope, string> = {
  [ApprovalWorkflowV2Scope.ITEM]: 'Approval chain for all Items.',
  [ApprovalWorkflowV2Scope.VENDOR]: 'Approval chain for all Vendors.',
  [ApprovalWorkflowV2Scope.BUDGET]: 'Approval chain for all Budgets.',
};

/** Map API steps to local state with stable client-side ids for React keys. */
const stepsFromApi = (apiSteps: IApprovalWorkflowV2Step[]): IFlowStep[] =>
  [...apiSteps]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: uid(),
      role: s.role,
      user_ids: s.user_ids.map(String),
    }));

export const WorkflowsV2Page = () => {
  const [scope, setScope] = useState<ApprovalWorkflowV2Scope | ''>('');
  const [steps, setSteps] = useState<IFlowStep[]>([]);
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [savingWorkflow, setSavingWorkflow] = useState(false);
  const fetchedUsers = useRef(false);

  useEffect(() => {
    if (fetchedUsers.current) return;
    fetchedUsers.current = true;
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

  useEffect(() => {
    if (scope === '') {
      setSteps([]);
      return;
    }
    let cancelled = false;
    setLoadingWorkflow(true);
    approvalWorkflowV2Service
      .getByScope(scope)
      .then((res) => {
        if (cancelled) return;
        const row = res.data;
        if (!row?.steps?.length) {
          setSteps([newStep(ApprovalWorkflowStepRole.REVIEWER)]);
        } else {
          setSteps(stepsFromApi(row.steps));
        }
      })
      .catch(() => {
        if (cancelled) return;
        message.error('Could not load workflow for this scope.');
        setSteps([newStep(ApprovalWorkflowStepRole.REVIEWER)]);
      })
      .finally(() => {
        if (!cancelled) setLoadingWorkflow(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const addStep = (
    role: ApprovalWorkflowStepRole = ApprovalWorkflowStepRole.REVIEWER,
  ) => {
    setSteps((prev) => [...prev, newStep(role)]);
  };

  const removeStep = (stepId: string) => {
    setSteps((prev) =>
      prev.length === 1 ? prev : prev.filter((s) => s.id !== stepId),
    );
  };

  const updateStep = (stepId: string, patch: Partial<IFlowStep>) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
    );
  };

  const handleSave = async () => {
    if (!scope) {
      message.error('Select a scope.');
      return;
    }
    const hasReviewer = steps.some(
      (s) => s.role === ApprovalWorkflowStepRole.REVIEWER,
    );
    const hasApprover = steps.some(
      (s) => s.role === ApprovalWorkflowStepRole.APPROVER,
    );
    if (!hasReviewer || !hasApprover) {
      const need: string[] = [];
      if (!hasReviewer) need.push('at least one reviewer step');
      if (!hasApprover) need.push('at least one approver step');
      message.error(`Add ${need.join(' and ')} before saving.`);
      return;
    }
    const reviewerHasUser = steps
      .filter((s) => s.role === ApprovalWorkflowStepRole.REVIEWER)
      .some((s) => s.user_ids.length > 0);
    const approverHasUser = steps
      .filter((s) => s.role === ApprovalWorkflowStepRole.APPROVER)
      .some((s) => s.user_ids.length > 0);
    if (!reviewerHasUser || !approverHasUser) {
      const need: string[] = [];
      if (!reviewerHasUser) need.push('a user on a reviewer step');
      if (!approverHasUser) need.push('a user on an approver step');
      message.error(`Assign ${need.join(' and ')} before saving.`);
      return;
    }

    const payload = {
      scope,
      steps: steps.map((s, idx) => ({
        order: idx + 1,
        role: s.role,
        user_ids: s.user_ids.map(Number),
      })),
    };
    setSavingWorkflow(true);
    try {
      await approvalWorkflowV2Service.save(payload);
      message.success('Workflow saved');
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Could not save workflow.');
    } finally {
      setSavingWorkflow(false);
    }
  };

  const scopeLabel = useMemo(() => {
    const opt = APPROVAL_WORKFLOW_V2_SCOPE_OPTIONS.find((o) => o.value === scope);
    return opt?.label ?? '';
  }, [scope]);

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 flex-shrink-0 border-b border-gray-100">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 min-w-0 flex-1">
              <div className="shrink-0">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Workflow size={18} className="text-emerald-600" />
                  Approval Workflow (V2)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {scope
                    ? SCOPE_DESCRIPTION[scope]
                    : 'Pick a scope to configure its approval chain.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 flex-1 min-w-0 max-w-md">
                <div className="min-w-0">
                  <ScopeFieldLabel>Scope</ScopeFieldLabel>
                  <Select
                    value={scope}
                    onChange={(v) => setScope(v as ApprovalWorkflowV2Scope)}
                    options={APPROVAL_WORKFLOW_V2_SCOPE_OPTIONS}
                    placeholder="Select scope"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!scope || savingWorkflow || loadingWorkflow}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm shrink-0 self-start xl:self-end disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
            >
              {savingWorkflow ? 'Saving…' : 'Save Workflow'}
            </button>
          </div>
        </div>

        {/* Body — hidden until a scope is chosen */}
        {scope ? (
          <div className="relative flex-1 min-h-0 overflow-y-auto soft-scroll">
            {loadingWorkflow ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                <span className="text-sm text-gray-600 font-medium">
                  Loading workflow…
                </span>
              </div>
            ) : null}

            <div className="p-6 space-y-6">
              {/* Flow preview */}
              <div className="rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className={`${SECTION_LABEL} shrink-0 sm:pt-0.5`}>
                    Flow Preview
                  </p>
                  <div className="min-w-0 flex-1">
                    <FlowPreview steps={steps} userOptions={userOptions} />
                  </div>
                </div>
              </div>

              {/* Approval sequence editor */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className={SECTION_LABEL}>
                    Approval sequence for all{' '}
                    {scopeLabel ? `${scopeLabel}s` : 'items'}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => addStep(ApprovalWorkflowStepRole.REVIEWER)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <Plus size={12} /> Reviewer
                    </button>
                    <button
                      type="button"
                      onClick={() => addStep(ApprovalWorkflowStepRole.APPROVER)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <Plus size={12} /> Approver
                    </button>
                  </div>
                </div>

                {steps.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No steps yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {steps.map((step, stepIdx) => (
                      <li key={step.id}>
                        <StepRow
                          index={stepIdx + 1}
                          step={step}
                          userOptions={userOptions}
                          loadingUsers={loadingUsers}
                          onChangeRole={(role) =>
                            updateStep(step.id, { role })
                          }
                          onChangeUsers={(user_ids) =>
                            updateStep(step.id, { user_ids })
                          }
                          onRemove={() => removeStep(step.id)}
                          canRemove={steps.length > 1}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyStatePlaceholder
            description={
              <>
                Choose a <span className="text-gray-700">scope</span>{' '}
                (Item, Vendor, or Budget) above to configure its approval chain.
              </>
            }
          />
        )}
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
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${ROLE_DOT[step.role]}`}
              />
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

export default WorkflowsV2Page;
