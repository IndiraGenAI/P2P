import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import {
  Check,
  ChevronsUpDown,
  Filter,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  Users as UsersIcon,
  X,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { Select } from '@/components/ui/Select';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Can } from '@/ability/can';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { searchRoleData } from '@/state/role/role.action';
import { roleSelector } from '@/state/role/role.reducer';
import {
  createNewUser,
  editUserById,
  removeUserById,
  searchUserData,
  updateUserStatus,
} from '@/state/user/user.action';
import { clearUserMessage, userSelector } from '@/state/user/user.reducer';
import type {
  IUserDetails,
  UserStatus,
} from '@/services/user/user.model';
import commonService from '@/services/common/common.service';
import { Common, StoragePath } from '@/utils/constants/constant';

const PROFILE_IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const PROFILE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp';

type SortKey =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'status'
  | 'created_date'
  | null;
type SortDir = 'asc' | 'desc';

interface FilterState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
}

interface UserFormState {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  image: string | null;
  status: UserStatus;
  role_ids: number[];
}

const EMPTY_FILTERS: FilterState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  status: '',
};

const EMPTY_FORM: UserFormState = {
  id: undefined,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  image: null,
  status: 'PENDING',
  role_ids: [],
};

const STATUS_FORM_OPTIONS = [
  { value: 'ENABLE', label: 'Enable' },
  { value: 'DISABLE', label: 'Disable' },
  { value: 'PENDING', label: 'Pending' },
];

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...STATUS_FORM_OPTIONS,
];

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

const TABLE_COLUMNS: { key: Exclude<SortKey, null>; label: string }[] = [
  { key: 'first_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
  { key: 'created_date', label: 'Created Date' },
];

const EXTRA_COLUMN_COUNT = 1;

const STATUS_BADGE: Record<UserStatus, string> = {
  ENABLE: 'bg-emerald-100 text-emerald-700',
  DISABLE: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  ENABLE: 'Enable',
  DISABLE: 'Disable',
  PENDING: 'Pending',
};

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

const buildSearchParams = (
  filters: FilterState,
  sort: { key: SortKey; dir: SortDir },
  page: number,
  pageSize: number,
): URLSearchParams => {
  const params = new URLSearchParams();
  params.set('skip', String((page - 1) * pageSize));
  params.set('take', String(pageSize));
  if (sort.key) {
    params.set('orderBy', sort.key);
    params.set('order', sort.dir.toUpperCase());
  }
  const merged: Record<string, string> = {
    ...filters,
  };
  for (const [key, value] of Object.entries(merged)) {
    if (value !== '' && value !== undefined && value !== null) {
      params.set(key, value);
    }
  }
  return params;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{6,20}$/;

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(userSelector);
  const roleState = useAppSelector(roleSelector);
  const allRoles = roleState.rolesData.data?.rows ?? [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: null,
    dir: 'asc',
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  // The image S3 key that was already saved on the user when the drawer
  // opened. Used to decide whether deleting the file should happen
  // immediately (it's a session-only orphan) or be deferred to "save"
  // (it's the persisted value the user might still cancel out of).
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null);

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<IUserDetails | null>(null);

  const rows = userState.usersData.data?.rows ?? [];
  const meta = userState.usersData.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = userState.usersData.loading;

  const isEdit = form.id !== undefined;
  const isSubmitting =
    userState.createUsers.loading || userState.editById.loading;



  const lastFetchRef = useRef<{ key: string; at: number } | null>(null);

  const refresh = (force = false) => {
    const params = buildSearchParams(appliedFilters, sort, page, pageSize);
    const key = params.toString();
    const now = Date.now();
    if (
      !force &&
      lastFetchRef.current &&
      lastFetchRef.current.key === key &&
      now - lastFetchRef.current.at < 100
    ) {
      return;
    }
    lastFetchRef.current = { key, at: now };
    dispatch(searchUserData(params));
  };

  useEffect(() => {
    refresh();

  }, [appliedFilters, sort, page, pageSize]);




  // StrictMode-safe one-shot dispatch — without the ref, both StrictMode
  // invocations of this effect see the initial render's closure and would
  // each fire `searchRoleData`, causing a duplicate /roles request in dev.
  const rolesFetchedRef = useRef(false);
  useEffect(() => {
    if (rolesFetchedRef.current) return;
    rolesFetchedRef.current = true;
    const params = new URLSearchParams();
    params.set('skip', '0');
    params.set('take', '100');
    params.set('status', 'true');
    dispatch(searchRoleData(params));
  }, [dispatch]);


  useEffect(() => {
    if (userState.createUsers.message) {
      if (userState.createUsers.hasErrors) {
        message.error(userState.createUsers.message);
      } else {
        message.success(userState.createUsers.message);
      }
      dispatch(clearUserMessage());
    }

  }, [userState.createUsers.message]);

  useEffect(() => {
    if (userState.editById.message) {
      if (userState.editById.hasErrors) {
        message.error(userState.editById.message);
      } else {
        message.success(userState.editById.message);
      }
      dispatch(clearUserMessage());
    }

  }, [userState.editById.message]);

  useEffect(() => {
    if (userState.removeById.message) {
      if (userState.removeById.hasErrors) {
        message.error(userState.removeById.message);
      } else {
        message.success(userState.removeById.message);
      }
      dispatch(clearUserMessage());
    }

  }, [userState.removeById.message]);

  useEffect(() => {
    if (userState.updateById.message) {
      if (userState.updateById.hasErrors) {
        message.error(userState.updateById.message);
      } else {
        message.success(userState.updateById.message);
      }
      dispatch(clearUserMessage());
    }

  }, [userState.updateById.message]);


  useEffect(() => {
    if (userState.usersData.message && userState.usersData.hasErrors) {
      message.error(userState.usersData.message);
      dispatch(clearUserMessage());
    }

  }, [userState.usersData.message, userState.usersData.hasErrors]);

  const activeFilterCount = useMemo(
    () => Object.values(appliedFilters).filter(Boolean).length,
    [appliedFilters],
  );

  const handleSort = (key: Exclude<SortKey, null>) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
    setPage(1);
  };

  const openCreateDrawer = () => {
    setForm(EMPTY_FORM);
    setOriginalImage(null);
    setPendingDeleteKey(null);
    setFormError(null);
    setIsFormDrawerOpen(true);
  };

  const openEditDrawer = (row: IUserDetails) => {
    const seededImage = row.image ?? null;
    setForm({
      id: row.id,
      first_name: row.first_name ?? '',
      last_name: row.last_name ?? '',
      email: row.email ?? '',
      phone: row.phone ?? '',
      password: '',
      image: seededImage,
      status: row.status ?? 'PENDING',
      role_ids: (row.roles ?? []).map((r) => r.id),
    });
    setOriginalImage(seededImage);
    setPendingDeleteKey(null);
    setFormError(null);
    setIsFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    // Clean up any newly-uploaded file the user is abandoning.
    if (form.image && form.image !== originalImage) {
      void commonService.deleteS3File(form.image);
    }
    setPendingDeleteKey(null);
    setIsFormDrawerOpen(false);
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (event.target) event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file.');
      return;
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      message.error('Image must be 2 MB or smaller.');
      return;
    }

    setImageUploading(true);
    try {
      const result = await commonService.s3FileUpload(
        file,
        StoragePath.PROFILE_IMAGES,
      );
      if (result.data?.fileUrl) {
        const newKey = result.data.fileUrl;
        const previousKey = form.image;
        if (previousKey && previousKey !== newKey) {
          if (previousKey === originalImage) {
            // The DB still points at this key — only delete it from
            // S3 once the user confirms by saving the form.
            setPendingDeleteKey(previousKey);
          } else {
            // Session-only orphan from a previous in-drawer upload —
            // safe to delete from S3 right away.
            void commonService.deleteS3File(previousKey);
          }
        }
        setForm((prev) => ({ ...prev, image: newKey }));
        message.success('Profile image uploaded.');
      } else {
        message.error('Failed to upload profile image.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload profile image.';
      message.error(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveProfileImage = () => {
    const currentKey = form.image;
    if (currentKey) {
      if (currentKey === originalImage) {
        setPendingDeleteKey(currentKey);
      } else {
        void commonService.deleteS3File(currentKey);
      }
    }
    setForm((prev) => ({ ...prev, image: null }));
  };

  const toggleFormRole = (roleId: number) => {
    setForm((prev) => {
      const existing = new Set(prev.role_ids);
      if (existing.has(roleId)) existing.delete(roleId);
      else existing.add(roleId);
      return { ...prev, role_ids: Array.from(existing) };
    });
  };

  const handleSubmitForm = async () => {
    const trimmed: UserFormState = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    };
    if (!trimmed.first_name) {
      setFormError('First name is required.');
      return;
    }
    if (!trimmed.last_name) {
      setFormError('Last name is required.');
      return;
    }
    if (!trimmed.email) {
      setFormError('Email is required.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!trimmed.phone) {
      setFormError('Phone is required.');
      return;
    }
    if (!PHONE_REGEX.test(trimmed.phone)) {
      setFormError('Please enter a valid phone number.');
      return;
    }
    if (!isEdit && !trimmed.password) {
      setFormError('Password is required.');
      return;
    }
    if (trimmed.password && trimmed.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setFormError(null);

    if (isEdit && trimmed.id !== undefined) {
      const payload: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        image: string | null;
        status: UserStatus;
        password?: string;
        role_ids: number[];
      } = {
        id: trimmed.id,
        first_name: trimmed.first_name,
        last_name: trimmed.last_name,
        email: trimmed.email,
        phone: trimmed.phone,
        image: trimmed.image,
        status: trimmed.status,
        role_ids: trimmed.role_ids,
      };
      if (trimmed.password) payload.password = trimmed.password;

      const result = await dispatch(editUserById(payload));
      if (editUserById.fulfilled.match(result)) {
        if (pendingDeleteKey && pendingDeleteKey !== trimmed.image) {
          void commonService.deleteS3File(pendingDeleteKey);
        }
        setPendingDeleteKey(null);
        setOriginalImage(trimmed.image ?? null);
        setIsFormDrawerOpen(false);
        refresh(true);
      }
    } else {
      const result = await dispatch(
        createNewUser({
          first_name: trimmed.first_name,
          last_name: trimmed.last_name,
          email: trimmed.email,
          phone: trimmed.phone,
          password: trimmed.password,
          image: trimmed.image,
          status: trimmed.status,
          role_ids: trimmed.role_ids,
        }),
      );
      if (createNewUser.fulfilled.match(result)) {
        setPendingDeleteKey(null);
        setOriginalImage(trimmed.image ?? null);
        setIsFormDrawerOpen(false);
        setPage(1);
        refresh(true);
      }
    }
  };

  const handleToggleStatus = async (row: IUserDetails, makeEnabled: boolean) => {
    const next: UserStatus = makeEnabled ? 'ENABLE' : 'DISABLE';
    const result = await dispatch(updateUserStatus({ id: row.id, status: next }));
    if (updateUserStatus.fulfilled.match(result)) refresh(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteRow) return;
    const imageKey = confirmDeleteRow.image ?? null;
    const result = await dispatch(removeUserById(confirmDeleteRow.id));
    setConfirmDeleteRow(null);
    if (removeUserById.fulfilled.match(result)) {
      if (imageKey) void commonService.deleteS3File(imageKey);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else refresh(true);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex = Math.min(page * pageSize, totalCount);

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <UsersIcon size={18} className="text-emerald-600" />
              Users
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} user{totalCount === 1 ? '' : 's'} configured
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setDraftFilters(appliedFilters);
                setIsFilterDrawerOpen(true);
              }}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
            >
              Filter <Filter size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Can I={Common.Actions.CAN_ADD} a={Common.Modules.USER_CONFIGURATION.USERS}>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New User
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
                  const active = sort.key === col.key;
                  return (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`flex items-center gap-1 select-none transition ${
                          active ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {col.label}
                        <ChevronsUpDown
                          size={12}
                          className={active ? 'text-emerald-600' : 'text-gray-400'}
                        />
                      </button>
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && (
                <TableRowSkeleton
                  rows={Math.min(pageSize, 10)}
                  columns={[
                    { key: 'name', width: 'w-40' },
                    { key: 'email', width: 'w-56' },
                    { key: 'phone', width: 'w-32' },
                    { key: 'status', width: 'w-20' },
                    { key: 'created', width: 'w-24' },
                    { key: 'roles', width: 'w-40' },
                  ]}
                />
              )}
              {rows.map((row, index) => {
                const fullName = [row.first_name, row.last_name].filter(Boolean).join(' ');
                const initials =
                  (row.first_name?.[0] ?? '').toUpperCase() +
                  (row.last_name?.[0] ?? '').toUpperCase();
                const status: UserStatus = row.status ?? 'PENDING';
                return (
                  <tr key={row.id} className="transition hover:bg-slate-50/60">
                    <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                      {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center overflow-hidden">
                          {row.image ? (
                            <img
                              src={commonService.resolvePublicUrl(row.image) ?? ''}
                              alt={fullName || row.email}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials || '?'
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {fullName || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 border-b border-slate-100/80">
                      {row.email || '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                      {row.phone || '—'}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <span
                        className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                      {formatDate(row.created_date)}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      {row.roles && row.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {row.roles.map((r) => (
                            <span
                              key={r.id}
                              title={r.name}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                            >
                              <ShieldCheck size={10} />
                              {r.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No roles
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <div className="flex items-center gap-2">
                        <Can
                          I={Common.Actions.CAN_UPDATE}
                          a={Common.Modules.USER_CONFIGURATION.USERS}
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={status === 'ENABLE'}
                            onClick={() => handleToggleStatus(row, status !== 'ENABLE')}
                            title={status === 'ENABLE' ? 'Disable user' : 'Enable user'}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                              status === 'ENABLE' ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                status === 'ENABLE' ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </Can>
                        <Can
                          I={Common.Actions.CAN_UPDATE}
                          a={Common.Modules.USER_CONFIGURATION.USERS}
                        >
                          <button
                            type="button"
                            onClick={() => openEditDrawer(row)}
                            aria-label={`Edit ${fullName || row.email}`}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                          >
                            <Pencil size={14} />
                          </button>
                        </Can>
                        <Can
                          I={Common.Actions.CAN_DELETE}
                          a={Common.Modules.USER_CONFIGURATION.USERS}
                        >
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRow(row)}
                            aria-label={`Delete ${fullName || row.email}`}
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
                    colSpan={TABLE_COLUMNS.length + EXTRA_COLUMN_COUNT + 2}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon size={28} className="text-gray-300" />
                      <p>No users found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new user.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4 flex-shrink-0 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <Select
                value={String(pageSize)}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
                options={PAGE_SIZE_OPTIONS}
                size="sm"
                fullWidth={false}
                className="w-20"
              />
              <span>entries</span>
            </div>
            <p className="text-sm text-gray-500">
              Showing {fromIndex} to {toIndex} of {totalCount} entries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium min-w-[36px] text-center">
              {page}
            </span>
            <span className="text-sm text-gray-400">of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Users"
        subtitle="Narrow down the user list"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setDraftFilters(EMPTY_FILTERS);
                setAppliedFilters(EMPTY_FILTERS);
                setIsFilterDrawerOpen(false);
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setAppliedFilters(draftFilters);
                setIsFilterDrawerOpen(false);
                setPage(1);
              }}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              First Name
            </label>
            <input
              type="text"
              value={draftFilters.first_name}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, first_name: e.target.value })
              }
              placeholder="Enter first name"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={draftFilters.last_name}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, last_name: e.target.value })
              }
              placeholder="Enter last name"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="text"
              value={draftFilters.email}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, email: e.target.value })
              }
              placeholder="Enter email"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Phone
            </label>
            <input
              type="text"
              value={draftFilters.phone}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, phone: e.target.value })
              }
              placeholder="Enter phone"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </label>
            <Select
              value={draftFilters.status}
              onChange={(v) => setDraftFilters({ ...draftFilters, status: v })}
              options={STATUS_FILTER_OPTIONS}
              placeholder="All statuses"
            />
          </div>
        </div>
      </Drawer>

      <FormModal
        isOpen={isFormDrawerOpen}
        onClose={closeFormDrawer}
        title={isEdit ? 'Edit User' : 'Create New User'}
        subtitle={
          isEdit
            ? 'Update the user details and save your changes.'
            : 'Add a new user to your organisation.'
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
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Update User' : 'Create User'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full bg-emerald-50 text-emerald-700 text-base font-semibold flex items-center justify-center overflow-hidden border border-emerald-100">
                {form.image ? (
                  <img
                    src={commonService.resolvePublicUrl(form.image) ?? ''}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {(form.first_name?.[0] ?? '').toUpperCase() +
                      (form.last_name?.[0] ?? '').toUpperCase() || '?'}
                  </span>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 size={18} className="animate-spin text-emerald-600" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept={PROFILE_IMAGE_ACCEPT}
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={imageUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Upload size={12} />
                    {form.image ? 'Replace image' : 'Upload image'}
                  </button>
                  {form.image && !imageUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-100 transition"
                    >
                      <X size={12} />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  PNG, JPG or WEBP &middot; up to 2 MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="e.g. Aisha"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="e.g. Khan"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 90000 00000"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              {isEdit ? 'Reset Password' : 'Password'}{' '}
              {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEdit ? 'Leave blank to keep current password' : 'At least 6 characters'}
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </label>
            <Select
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as UserStatus })}
              options={STATUS_FORM_OPTIONS}
              placeholder="Select status"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Assigned Roles
              </label>
              <span className="text-[11px] text-gray-400">
                {form.role_ids.length} selected
              </span>
            </div>
            {allRoles.length === 0 ? (
              <p className="text-xs text-gray-400 italic px-3 py-2 rounded-lg bg-slate-50 border border-dashed border-slate-200">
                No active roles available. Create a role first to assign it
                here.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allRoles.map((role) => {
                  const checked = form.role_ids.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleFormRole(role.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                        checked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      {checked ? (
                        <Check size={12} />
                      ) : (
                        <ShieldCheck size={12} />
                      )}
                      {role.name}
                    </button>
                  );
                })}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-gray-400">
              Permissions for this user are derived from the assigned roles.
            </p>
          </div>
        </div>
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
                  <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-900">
                      {[confirmDeleteRow.first_name, confirmDeleteRow.last_name]
                        .filter(Boolean)
                        .join(' ') || confirmDeleteRow.email}
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
                disabled={userState.removeById.loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {userState.removeById.loading && (
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

export default UsersPage;
