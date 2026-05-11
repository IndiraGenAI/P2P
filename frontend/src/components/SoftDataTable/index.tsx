import type { Key, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronsUpDown } from 'lucide-react';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export type SoftSortDir = 'ASC' | 'DESC';

export interface ISoftColumn<T> {
  /** Unique key for React reconciliation. */
  key: string;
  /** Header content. */
  title: ReactNode;
  /**
   * If set, the column is sortable. The value is stored in URL `orderBy`
   * when the header is clicked. Title should be a string for sortable cols.
   */
  sortable?: string;
  align?: 'left' | 'right' | 'center';
  headerClassName?: string;
  cellClassName?: string;
  /** Tailwind width utility (e.g. `w-32`) used by the loading skeleton. */
  skeletonWidth?: string;
  /** Cell renderer. */
  render: (row: T, index: number) => ReactNode;
}

export interface ISoftDataTableProps<T> {
  columns: ISoftColumn<T>[];
  data: T[];
  loading?: boolean;
  meta?: IMetaProps;

  /** Stable row key. Defaults to `row.id` (or row index as fallback). */
  rowKey?: (row: T, index: number) => Key;

  /** Show the leading "No." column. Default `true`. */
  showIndex?: boolean;
  /** Column header text for the index column. Default `"No"`. */
  indexHeader?: ReactNode;

  /** When provided, an Actions column is rendered at the end. */
  renderActions?: (row: T, index: number) => ReactNode;
  actionsHeader?: ReactNode;

  /** Empty-state UI. */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;

  /** Pagination. */
  hidePagination?: boolean;
  defaultPageSize?: number;

  /** Extra classes for the scroll container. */
  className?: string;

  /** Row click handler. */
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
}

function getAlignClass(align: ISoftColumn<unknown>['align']): string {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

interface SortHeaderProps {
  label: string;
  column: string;
  activeKey: string;
  activeDir: SoftSortDir;
  onSort: (k: string) => void;
}

function SortHeader({
  label,
  column,
  activeKey,
  onSort,
}: Readonly<SortHeaderProps>) {
  const active = activeKey === column;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`flex items-center gap-1 select-none transition ${
        active ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      <ChevronsUpDown
        size={12}
        className={active ? 'text-emerald-600' : 'text-gray-400'}
      />
    </button>
  );
}

/**
 * Reusable list table styled like the project's soft-card pattern.
 *
 * Features:
 *  - Data-driven columns array (similar shape to AntD `ColumnsType`).
 *  - Sortable headers via URL params (`orderBy`, `order`).
 *  - Built-in loading skeleton, empty state, and pagination.
 *  - Optional leading index column and trailing actions column.
 *
 * Pair with a `useSearchParams()`-driven listing page; the table handles
 * sort and pagination URL writes itself so callers only need to dispatch
 * their list action when `searchParams` change.
 */
export function SoftDataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading = false,
  meta,
  rowKey,
  showIndex = true,
  indexHeader = 'No',
  renderActions,
  actionsHeader = 'Actions',
  emptyTitle = 'No records found.',
  emptyDescription,
  emptyIcon,
  hidePagination = false,
  defaultPageSize = 10,
  className,
  onRowClick,
  rowClassName,
}: Readonly<ISoftDataTableProps<T>>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const take = Number(searchParams.get('take')) || defaultPageSize;
  const skip = Number(searchParams.get('skip')) || 0;
  const page = Math.floor(skip / take) + 1;
  const sortKey = searchParams.get('orderBy') ?? '';
  const sortDir: SoftSortDir =
    (searchParams.get('order') ?? 'ASC').toUpperCase() === 'DESC'
      ? 'DESC'
      : 'ASC';

  const handleSort = (key: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('skip', '0');
    if (sortKey !== key) {
      sp.set('orderBy', key);
      sp.set('order', 'ASC');
    } else if (sortDir === 'ASC') {
      sp.set('orderBy', key);
      sp.set('order', 'DESC');
    } else {
      sp.delete('orderBy');
      sp.delete('order');
    }
    setSearchParams(sp);
  };

  const totalLeadingTrailing =
    (showIndex ? 1 : 0) + (renderActions ? 1 : 0);
  const emptyColSpan = columns.length + totalLeadingTrailing;

  const skeletonColumns = columns.map((c) => ({
    key: c.key,
    width: c.skeletonWidth,
  }));

  const getRowKey = (row: T, index: number): Key => {
    if (rowKey) return rowKey(row, index);
    const id = row.id;
    if (id !== undefined && id !== null) return id;
    return index;
  };

  return (
    <>
      <div className={`flex-1 overflow-auto relative ${className ?? ''}`}>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50">
              {showIndex && (
                <th className="w-16 pl-6 pr-4 py-3 bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {indexHeader}
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 ${getAlignClass(col.align)} ${col.headerClassName ?? ''}`}
                >
                  {col.sortable && typeof col.title === 'string' ? (
                    <SortHeader
                      label={col.title}
                      column={col.sortable}
                      activeKey={sortKey}
                      activeDir={sortDir}
                      onSort={handleSort}
                    />
                  ) : (
                    col.title
                  )}
                </th>
              ))}
              {renderActions && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <TableRowSkeleton
                rows={Math.min(take, 10)}
                columns={skeletonColumns}
                withActions={!!renderActions}
              />
            )}

            {!loading &&
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className={`transition hover:bg-slate-50/60 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${rowClassName ? rowClassName(row, index) : ''}`}
                  onClick={
                    onRowClick ? () => onRowClick(row, index) : undefined
                  }
                >
                  {showIndex && (
                    <td className="w-16 pl-6 pr-4 py-4 text-sm font-medium text-gray-500 border-b border-slate-100/80">
                      {(page - 1) * take + index + 1}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-sm text-gray-700 border-b border-slate-100/80 ${
                        col.cellClassName ?? ''
                      }`}
                    >
                      {col.render(row, index)}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-4 border-b border-slate-100/80">
                      <div className="flex items-center gap-2">
                        {renderActions(row, index)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={emptyColSpan}
                  className="px-6 py-16 text-center text-sm text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon}
                    <p>{emptyTitle}</p>
                    {emptyDescription && (
                      <p className="text-xs text-gray-400">
                        {emptyDescription}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!hidePagination && (
        <TablePagination meta={meta} defaultPageSize={defaultPageSize} />
      )}
    </>
  );
}

export default SoftDataTable;
