import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import {
  ChevronsUpDown,
  Filter,
  Flag,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { FormModal } from '@/components/ui/FormModal';
import { Select } from '@/components/ui/Select';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Can } from '@/ability/can';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import {
  createNewCountry,
  editCountryById,
  removeCountryById,
  searchCountryData,
  updateCountryStatus,
} from '@/state/country/country.action';
import {
  clearCountryMessage,
  countrySelector,
} from '@/state/country/country.reducer';
import type { ICountryDetails } from '@/services/country/country.model';
import { Common } from '@/utils/constants/constant';

type SortKey = 'name' | 'created_date' | 'status' | null;
type SortDir = 'asc' | 'desc';

interface FilterState {
  name: string;
  status: string;
}

interface CountryFormState {
  id?: number;
  name: string;
}

const EMPTY_FILTERS: FilterState = {
  name: '',
  status: '',
};

const EMPTY_FORM: CountryFormState = {
  id: undefined,
  name: '',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

const TABLE_COLUMNS: { key: Exclude<SortKey, null>; label: string }[] = [
  { key: 'name', label: 'Country Name' },
  { key: 'status', label: 'Status' },
  { key: 'created_date', label: 'Created Date' },
];

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
  quickSearch: string,
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
    ...(quickSearch ? { name: quickSearch } : {}),
  };
  for (const [key, value] of Object.entries(merged)) {
    if (value !== '' && value !== undefined && value !== null) {
      params.set(key, value);
    }
  }
  return params;
};

export const CountryPage = () => {
  const dispatch = useAppDispatch();
  const countryState = useAppSelector(countrySelector);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: null,
    dir: 'asc',
  });
  const [quickSearch, setQuickSearch] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [form, setForm] = useState<CountryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<ICountryDetails | null>(
    null,
  );

  const rows = countryState.countriesData.data?.rows ?? [];
  const meta = countryState.countriesData.data?.meta;
  const totalCount = meta?.itemCount ?? 0;
  const isLoading = countryState.countriesData.loading;

  const isEdit = form.id !== undefined;
  const isSubmitting =
    countryState.createCountry.loading || countryState.editById.loading;

  const lastFetchRef = useRef<{ key: string; at: number } | null>(null);

  const refresh = (force = false) => {
    const params = buildSearchParams(appliedFilters, sort, page, pageSize, quickSearch);
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
    dispatch(searchCountryData(params));
  };

  useEffect(() => {
    refresh();
  }, [appliedFilters, sort, page, pageSize, quickSearch]);

  useEffect(() => {
    if (countryState.createCountry.message) {
      if (countryState.createCountry.hasErrors) {
        message.error(countryState.createCountry.message);
      } else {
        message.success(countryState.createCountry.message);
      }
      dispatch(clearCountryMessage());
    }
  }, [countryState.createCountry.message]);

  useEffect(() => {
    if (countryState.editById.message) {
      if (countryState.editById.hasErrors) {
        message.error(countryState.editById.message);
      } else {
        message.success(countryState.editById.message);
      }
      dispatch(clearCountryMessage());
    }
  }, [countryState.editById.message]);

  useEffect(() => {
    if (countryState.removeById.message) {
      if (countryState.removeById.hasErrors) {
        message.error(countryState.removeById.message);
      } else {
        message.success(countryState.removeById.message);
      }
      dispatch(clearCountryMessage());
    }
  }, [countryState.removeById.message]);

  useEffect(() => {
    if (countryState.updateById.message) {
      if (countryState.updateById.hasErrors) {
        message.error(countryState.updateById.message);
      } else {
        message.success(countryState.updateById.message);
      }
      dispatch(clearCountryMessage());
    }
  }, [countryState.updateById.message]);

  useEffect(() => {
    if (
      countryState.countriesData.message &&
      countryState.countriesData.hasErrors
    ) {
      message.error(countryState.countriesData.message);
      dispatch(clearCountryMessage());
    }
  }, [countryState.countriesData.message, countryState.countriesData.hasErrors]);

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
    setFormError(null);
    setIsFormDrawerOpen(true);
  };

  const openEditDrawer = (row: ICountryDetails) => {
    setForm({
      id: row.id,
      name: row.name ?? '',
    });
    setFormError(null);
    setIsFormDrawerOpen(true);
  };

  const handleSubmitForm = async () => {
    const trimmed: CountryFormState = {
      ...form,
      name: form.name.trim(),
    };
    if (!trimmed.name) {
      setFormError('Country name is required.');
      return;
    }
    setFormError(null);

    if (isEdit && trimmed.id !== undefined) {
      const result = await dispatch(
        editCountryById({ id: trimmed.id, name: trimmed.name }),
      );
      if (editCountryById.fulfilled.match(result)) {
        setIsFormDrawerOpen(false);
        refresh(true);
      }
    } else {
      const result = await dispatch(
        createNewCountry({ id: 0, name: trimmed.name } as ICountryDetails),
      );
      if (createNewCountry.fulfilled.match(result)) {
        setIsFormDrawerOpen(false);
        setPage(1);
        refresh(true);
      }
    }
  };

  const handleToggleStatus = async (row: ICountryDetails, checked: boolean) => {
    const result = await dispatch(
      updateCountryStatus({ id: row.id, status: checked }),
    );
    if (updateCountryStatus.fulfilled.match(result)) refresh(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteRow) return;
    const result = await dispatch(removeCountryById(confirmDeleteRow.id));
    setConfirmDeleteRow(null);
    if (removeCountryById.fulfilled.match(result)) {
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
              <Flag size={18} className="text-emerald-600" />
              Country
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} countr{totalCount === 1 ? 'y' : 'ies'} configured
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
                value={quickSearch}
                onChange={(e) => {
                  setQuickSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name…"
                className="pl-9 pr-3 py-2 rounded-xl text-sm soft-input w-56"
              />
            </div>

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

            <Can I={Common.Actions.CAN_ADD} a={Common.Modules.MASTER.COUNTRY}>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
              >
                <Plus size={14} /> New Country
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
                    { key: 'status', width: 'w-20' },
                    { key: 'created', width: 'w-24' },
                  ]}
                />
              )}
              {rows.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-slate-50/60">
                  <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                    {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
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
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {formatDate(
                      (row as unknown as Record<string, unknown>).created_date ??
                        (row as unknown as Record<string, unknown>).createdDate,
                    )}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <div className="flex items-center gap-2">
                      <Can
                        I={Common.Actions.CAN_UPDATE}
                        a={Common.Modules.MASTER.COUNTRY}
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
                        a={Common.Modules.MASTER.COUNTRY}
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
                      <Flag size={28} className="text-gray-300" />
                      <p>No countries found.</p>
                      <p className="text-xs text-gray-400">
                        Try clearing the filters or create a new country.
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
        title="Filter Countries"
        subtitle="Narrow down the country list"
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
              Name
            </label>
            <input
              type="text"
              value={draftFilters.name}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, name: e.target.value })
              }
              placeholder="Enter country name"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = draftFilters.status === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() =>
                      setDraftFilters({ ...draftFilters, status: opt.value })
                    }
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
          </div>
        </div>
      </Drawer>

      <FormModal
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        size="md"
        title={isEdit ? 'Edit Country' : 'Create New Country'}
        subtitle={
          isEdit
            ? 'Update the country details and save your changes.'
            : 'Add a new country to the geography master.'
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
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Update Country' : 'Create Country'}
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
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. India"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm soft-input"
            />
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delete Country
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
                disabled={countryState.removeById.loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {countryState.removeById.loading && (
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

export default CountryPage;
