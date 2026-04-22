import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { ArrowLeft, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';
import { PermissionPanelSkeleton } from '@/components/ui/Skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { fetchProfile } from '@/state/auth/auth.action';
import { authSelector } from '@/state/auth/auth.reducer';
import { getRolePermissions } from '@/state/role/role.action';
import { roleSelector } from '@/state/role/role.reducer';
import { saveRolePermissions } from '@/state/rolePermissions/rolePermissions.action';
import {
  clearMessage,
  rolePermissionsSelector,
} from '@/state/rolePermissions/rolePermissions.reducer';
import type {
  IPage,
  IPageAction,
  IRolePermission,
} from '@/pages/Permissions/Permission.model';
import { ActionType } from '@/utils/constants/constant';

interface ModuleGroup {
  module: IPage;
  children: IPage[];
}

const groupPages = (pages: IPage[]): ModuleGroup[] => {
  const parents = pages.filter((p) => p.parent_page_id == null);
  const children = pages.filter((p) => p.parent_page_id != null);
  return parents
    .map((module) => ({
      module,
      children: children.filter((c) => c.parent_page_id === module.id),
    }))
    .filter((g) => g.children.length > 0 || (g.module.page_actions?.length ?? 0) > 0);
};

interface CheckboxPillProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function CheckboxPill({ label, checked, onToggle }: Readonly<CheckboxPillProps>) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
        checked
          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-gray-300 bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5L4.5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

interface PageRowProps {
  page: IPage;
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
}

const NON_VIEW_ACTIONS: ReadonlySet<string> = new Set([
  ActionType.CREATE,
  ActionType.UPDATE,
  ActionType.DELETE,
  ActionType.FULL_VIEW,
  ActionType.EXPORT_DATA,
  ActionType.ASSIGN_PERMISSION,
]);

function PageRow({ page, selected, onChange }: Readonly<PageRowProps>) {
  const actions = page.page_actions ?? [];
  const viewAction = actions.find(
    (pa) => pa.action.action_code === ActionType.VIEW,
  );

  const allIds = useMemo(() => actions.map((pa) => pa.id), [actions]);
  const allChecked =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const noneChecked = allIds.every((id) => !selected.has(id));

  const togglePageAction = (pa: IPageAction) => {
    const next = new Set(selected);
    if (next.has(pa.id)) {
      next.delete(pa.id);
      // If we just turned off VIEW, drop everything else for this page so
      // the user can't keep CRUD permissions without read access.
      if (pa.action.action_code === ActionType.VIEW) {
        allIds.forEach((id) => next.delete(id));
      }
    } else {
      next.add(pa.id);
      // Granting any non-VIEW action implicitly grants VIEW.
      if (
        viewAction &&
        NON_VIEW_ACTIONS.has(pa.action.action_code) &&
        !next.has(viewAction.id)
      ) {
        next.add(viewAction.id);
      }
    }
    onChange(next);
  };

  const setAll = (value: boolean) => {
    const next = new Set(selected);
    if (value) {
      allIds.forEach((id) => next.add(id));
    } else {
      allIds.forEach((id) => next.delete(id));
    }
    onChange(next);
  };

  return (
    <div className="px-4 py-3 border-b border-slate-100/80 last:border-b-0 grid grid-cols-1 md:grid-cols-[minmax(0,200px)_1fr_auto] gap-3 md:items-center">
      <div className="text-sm font-medium text-gray-800 truncate" title={page.name}>
        {page.name}
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.length === 0 && (
          <span className="text-xs text-gray-400">No actions configured.</span>
        )}
        {actions.map((pa) => (
          <CheckboxPill
            key={pa.id}
            label={pa.action.name}
            checked={selected.has(pa.id)}
            onToggle={() => togglePageAction(pa)}
          />
        ))}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            disabled={allChecked}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            disabled={noneChecked}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            None
          </button>
        </div>
      )}
    </div>
  );
}

interface ModulePanelProps {
  group: ModuleGroup;
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
}

function ModulePanel({ group, selected, onChange }: Readonly<ModulePanelProps>) {
  const [open, setOpen] = useState(true);

  const allChildIds = useMemo(() => {
    const ids: number[] = [];
    group.children.forEach((p) =>
      (p.page_actions ?? []).forEach((pa) => ids.push(pa.id)),
    );
    (group.module.page_actions ?? []).forEach((pa) => ids.push(pa.id));
    return ids;
  }, [group]);

  const grantedCount = allChildIds.filter((id) => selected.has(id)).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {group.module.name}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {grantedCount} of {allChildIds.length} permissions granted
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div>
          {(group.module.page_actions?.length ?? 0) > 0 && (
            <PageRow
              page={group.module}
              selected={selected}
              onChange={onChange}
            />
          )}
          {group.children.map((child) => (
            <PageRow
              key={child.id}
              page={child}
              selected={selected}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const PermissionsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const roleId = Number(params.id);

  const { getPermissions } = useAppSelector(roleSelector);
  const { profile } = useAppSelector(authSelector);
  const rolePermissionsState = useAppSelector(rolePermissionsSelector);

  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!Number.isFinite(roleId) || roleId <= 0) return;
    dispatch(getRolePermissions(roleId));
  }, [dispatch, roleId]);

  // When the backend sends back the role + its current role_permissions,
  // pre-populate the ticked checkboxes from the page_action ids.
  useEffect(() => {
    const ids = (getPermissions.data.role_permissions ?? [])
      .map((rp: IRolePermission) => rp.page_action?.id)
      .filter((id): id is number => typeof id === 'number');
    setSelected(new Set(ids));
  }, [getPermissions.data]);

  useEffect(() => {
    if (rolePermissionsState.saveRolePermissions.message) {
      if (rolePermissionsState.saveRolePermissions.hasErrors) {
        message.error(rolePermissionsState.saveRolePermissions.message);
      } else {
        message.success(rolePermissionsState.saveRolePermissions.message);
      }
      dispatch(clearMessage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolePermissionsState.saveRolePermissions.message]);

  const groups = useMemo(
    () => groupPages(getPermissions.data.pages ?? []),
    [getPermissions.data.pages],
  );

  const handleSubmit = async () => {
    if (!Number.isFinite(roleId) || roleId <= 0) return;
    const result = await dispatch(
      saveRolePermissions({
        role_id: roleId,
        page_action_ids: [...selected],
        created_by: profile.data?.id ?? null,
      }),
    );
    if (saveRolePermissions.fulfilled.match(result)) {
      // Refresh the user's own profile so any permission change that affects
      // *the current user's role* is reflected in CASL + sidebar immediately.
      dispatch(fetchProfile());
    }
  };

  const isLoading = getPermissions.loading;
  const isSaving = rolePermissionsState.saveRolePermissions.loading;
  const totalSelected = selected.size;

  const totalPossible = useMemo(() => {
    let count = 0;
    (getPermissions.data.pages ?? []).forEach((p) => {
      count += p.page_actions?.length ?? 0;
    });
    return count;
  }, [getPermissions.data.pages]);

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/roles"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              aria-label="Back to roles"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                Permissions
                {getPermissions.data.name && (
                  <>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-700">{getPermissions.data.name}</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalSelected} of {totalPossible} permissions assigned
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/roles')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save Permissions
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {isLoading && <PermissionPanelSkeleton cards={4} rowsPerCard={3} />}

          {!isLoading && groups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <ShieldCheck size={32} className="text-gray-300 mb-2" />
              <p className="text-sm">No pages configured for permissions yet.</p>
              <p className="text-xs mt-1">
                Seed the <code className="px-1 py-0.5 bg-gray-100 rounded">pages</code>{' '}
                and{' '}
                <code className="px-1 py-0.5 bg-gray-100 rounded">page_actions</code>{' '}
                tables to populate this view.
              </p>
            </div>
          )}

          {!isLoading &&
            groups.map((group) => (
              <ModulePanel
                key={group.module.id}
                group={group}
                selected={selected}
                onChange={setSelected}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
