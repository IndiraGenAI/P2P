import { useMemo, useState } from 'react';
import { ChevronsUpDown, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import { tableData } from '@/data/mockData';
import { Drawer } from '@/components/ui/Drawer';
import { Select } from '@/components/ui/Select';

interface Filters {
  position: string;
  office: string;
  status: string;
  minSalary: string;
  maxSalary: string;
}

const emptyFilters: Filters = {
  position: '',
  office: '',
  status: '',
  minSalary: '',
  maxSalary: '',
};

const parseSalary = (s: string) => Number(s.replaceAll(/[^0-9.]/g, '')) || 0;

export function DataTablePage() {
  const [pageSize, setPageSize] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);

  const positions = useMemo(
    () => Array.from(new Set(tableData.map((r) => r.position))),
    [],
  );
  const offices = useMemo(
    () => Array.from(new Set(tableData.map((r) => r.office))),
    [],
  );

  const filtered = useMemo(() => {
    return tableData.filter((row) => {
      if (applied.position && row.position !== applied.position) return false;
      if (applied.office && row.office !== applied.office) return false;
      if (applied.status && row.status !== applied.status) return false;

      const sal = parseSalary(row.salary);
      if (applied.minSalary && sal < Number(applied.minSalary)) return false;
      if (applied.maxSalary && sal > Number(applied.maxSalary)) return false;

      return true;
    });
  }, [applied]);

  const visible = filtered.slice(0, pageSize);

  const activeFilterCount = Object.values(applied).filter(Boolean).length;

  const openFilters = () => {
    setDraft(applied);
    setDrawerOpen(true);
  };

  const handleApply = () => {
    setApplied(draft);
    setDrawerOpen(false);
  };

  const handleReset = () => {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
  };

  return (
    <div className="p-6 h-full">
      <div className="soft-card h-full flex flex-col overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">All Users</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} record{filtered.length === 1 ? '' : 's'} found
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
              onClick={openFilters}
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
                {['User', 'Position', 'Salary', 'Office', 'Status', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      {h}
                      <ChevronsUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, index) => {
                return (
                  <tr key={row.id} className="transition hover:bg-slate-50/50">
                    <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                      {String(index + 1).padStart(2, '0')}
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
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.status === 'Hired'
                            ? 'soft-pill-emerald text-emerald-700'
                            : 'soft-pill-amber text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
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
                onChange={(v) => setPageSize(Number(v))}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                size="sm"
                fullWidth={false}
                className="w-20"
              />
              <span>entries</span>
            </div>
            <p className="text-sm text-gray-500">
              Showing 1 to {visible.length} of {filtered.length} entries
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
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        subtitle="Refine the records shown in the table"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
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
              value={draft.position}
              onChange={(v) => setDraft({ ...draft, position: v })}
              placeholder="All positions"
              options={[
                { value: '', label: 'All positions' },
                ...positions.map((p) => ({ value: p, label: p })),
              ]}
            />
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Office
            </p>
            <Select
              value={draft.office}
              onChange={(v) => setDraft({ ...draft, office: v })}
              placeholder="All offices"
              options={[
                { value: '', label: 'All offices' },
                ...offices.map((o) => ({ value: o, label: o })),
              ]}
            />
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Status
            </p>
            <div className="flex gap-2">
              {['', 'Hired', 'Pending'].map((s) => {
                const label = s || 'All';
                const isActive = draft.status === s;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraft({ ...draft, status: s })}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {label}
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
                  value={draft.minSalary}
                  onChange={(e) => setDraft({ ...draft, minSalary: e.target.value })}
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
                  value={draft.maxSalary}
                  onChange={(e) => setDraft({ ...draft, maxSalary: e.target.value })}
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
