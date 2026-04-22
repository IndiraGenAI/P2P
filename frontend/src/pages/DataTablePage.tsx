import { useMemo, useState } from 'react';
import { ChevronsUpDown, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Select } from '@/components/ui/Select';
import { MOCK_USERS } from '@/data';
import { UserStatus } from '@/common/enums';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  STATUS_COLORS,
} from '@/common/constants';
import { padNumber, parseSalary } from '@/common/utils';
import type { UserFilters } from '@/common/models';

const EMPTY_FILTERS: UserFilters = {
  position: '',
  office: '',
  status: '',
  minSalary: '',
  maxSalary: '',
};

const TABLE_COLUMNS = ['User', 'Position', 'Salary', 'Office', 'Status', 'Action'];

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: UserStatus.Hired, label: 'Hired' },
  { value: UserStatus.Pending, label: 'Pending' },
];

const TOTAL_TABLE_COLUMNS = TABLE_COLUMNS.length + 1;

export function DataTablePage() {
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<UserFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>(EMPTY_FILTERS);

  const positionOptions = useMemo(
    () => [
      { value: '', label: 'All positions' },
      ...Array.from(new Set(MOCK_USERS.map((row) => row.position))).map((position) => ({
        value: position,
        label: position,
      })),
    ],
    [],
  );

  const officeOptions = useMemo(
    () => [
      { value: '', label: 'All offices' },
      ...Array.from(new Set(MOCK_USERS.map((row) => row.office))).map((office) => ({
        value: office,
        label: office,
      })),
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((row) => {
      if (appliedFilters.position && row.position !== appliedFilters.position) return false;
      if (appliedFilters.office && row.office !== appliedFilters.office) return false;
      if (appliedFilters.status && row.status !== appliedFilters.status) return false;

      const salaryValue = parseSalary(row.salary);
      if (appliedFilters.minSalary && salaryValue < Number(appliedFilters.minSalary)) {
        return false;
      }
      if (appliedFilters.maxSalary && salaryValue > Number(appliedFilters.maxSalary)) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  const visibleUsers = filteredUsers.slice(0, pageSize);
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  const openFilterDrawer = () => {
    setDraftFilters(appliedFilters);
    setIsFilterDrawerOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const getStatusBadgeClasses = (status: UserStatus) => {
    const palette =
      status === UserStatus.Hired ? STATUS_COLORS.success : STATUS_COLORS.warning;
    return `${palette.bg} ${palette.text}`;
  };

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">All Users</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredUsers.length} record{filteredUsers.length === 1 ? '' : 's'} found
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
            >
              Download <Download size={14} />
            </button>
            <button
              type="button"
              onClick={openFilterDrawer}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
            >
              Filter <Filter size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                <th className="w-16 pl-6 pr-4 py-3 bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sr No
                </th>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      {column}
                      <ChevronsUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-slate-50/50">
                  <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                    {padNumber(index + 1)}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <p className="font-semibold text-gray-900 text-sm">{row.user}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{row.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {row.position}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {row.salary}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b border-slate-100/80">
                    {row.office}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClasses(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100/80">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Delete row"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Edit row"
                        className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={TOTAL_TABLE_COLUMNS}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4 flex-shrink-0 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <Select
                value={String(pageSize)}
                onChange={(value) => setPageSize(Number(value))}
                options={PAGE_SIZE_OPTIONS}
                size="sm"
                fullWidth={false}
                className="w-20"
              />
              <span>entries</span>
            </div>
            <p className="text-sm text-gray-500">
              Showing 1 to {visibleUsers.length} of {filteredUsers.length} entries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filters"
        subtitle="Refine the records shown in the table"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Position
            </p>
            <Select
              value={draftFilters.position}
              onChange={(value) => setDraftFilters({ ...draftFilters, position: value })}
              placeholder="All positions"
              options={positionOptions}
            />
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Office
            </p>
            <Select
              value={draftFilters.office}
              onChange={(value) => setDraftFilters({ ...draftFilters, office: value })}
              placeholder="All offices"
              options={officeOptions}
            />
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </p>
            <div className="flex gap-2">
              {STATUS_FILTER_OPTIONS.map((option) => {
                const isActive = draftFilters.status === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() =>
                      setDraftFilters({ ...draftFilters, status: option.value })
                    }
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Salary Range
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="filter-min" className="block text-xs text-gray-500 mb-1">
                  Min
                </label>
                <input
                  id="filter-min"
                  type="number"
                  placeholder="0"
                  value={draftFilters.minSalary}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, minSalary: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm soft-input"
                />
              </div>
              <div>
                <label htmlFor="filter-max" className="block text-xs text-gray-500 mb-1">
                  Max
                </label>
                <input
                  id="filter-max"
                  type="number"
                  placeholder="100000"
                  value={draftFilters.maxSalary}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, maxSalary: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm soft-input"
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
