import type { CSSProperties } from 'react';

interface SkeletonProps {

  width?: string;

  height?: string;

  rounded?: string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
  style,
}: Readonly<SkeletonProps>) {
  return (
    <div
      aria-hidden
      style={style}
      className={`animate-pulse bg-slate-200/70 ${rounded} ${width} ${height} ${className}`}
    />
  );
}

const SKELETON_SLOTS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
] as const;
const slotKey = (idx: number) => SKELETON_SLOTS[idx % SKELETON_SLOTS.length];

interface TableRowSkeletonProps {
  /** How many shimmer rows to render. Default 5. */
  rows?: number;
  /** Cell descriptors. The first cell renders the Sr No bubble; the rest are
   *  flexible. Width is a Tailwind utility (e.g. `w-32`, `w-1/2`). */
  columns: ReadonlyArray<{ key: string; width?: string }>;
  /** Whether to render the trailing Action column (defaults to true). */
  withActions?: boolean;
}

/**
 * Renders shimmer `<tr>` rows that match the layout of the listings in this
 * project (Sr No · data columns · Action). Drop it inside `<tbody>` while a
 * fetch is pending instead of using a centred spinner.
 */
export function TableRowSkeleton({
  rows = 5,
  columns,
  withActions = true,
}: Readonly<TableRowSkeletonProps>) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={`skel-row-${slotKey(idx)}`} className="bg-white">
          <td className="w-16 pl-6 pr-4 py-4 border-b border-slate-100/80">
            <Skeleton width="w-6" height="h-3.5" />
          </td>
          {columns.map((col) => (
            <td
              key={col.key}
              className="px-4 py-4 border-b border-slate-100/80"
            >
              <Skeleton
                width={col.width ?? 'w-32'}
                height="h-3.5"
              />
            </td>
          ))}
          {withActions && (
            <td className="px-4 py-4 border-b border-slate-100/80">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" rounded="rounded" />
                <Skeleton className="h-6 w-6" rounded="rounded" />
                <Skeleton className="h-6 w-6" rounded="rounded" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

interface PermissionPanelSkeletonProps {
  /** How many module cards to render. Default 3. */
  cards?: number;
  /** How many child rows per module card. Default 3. */
  rowsPerCard?: number;
}

/**
 * Mirrors the `<ModulePanel>` layout used by `PermissionsPage`: a rounded
 * collapsible card containing a header strip and a few row stubs of pill
 * checkboxes.
 */
export function PermissionPanelSkeleton({
  cards = 3,
  rowsPerCard = 3,
}: Readonly<PermissionPanelSkeletonProps>) {
  return (
    <>
      {Array.from({ length: cards }).map((_, cardIdx) => (
        <div
          key={`perm-skel-card-${slotKey(cardIdx)}`}
          className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
        >
          <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" rounded="rounded" />
              <div className="flex flex-col gap-1.5">
                <Skeleton width="w-40" height="h-3.5" />
                <Skeleton width="w-24" height="h-2.5" />
              </div>
            </div>
            <Skeleton className="h-3 w-3" rounded="rounded" />
          </div>
          <div>
            {Array.from({ length: rowsPerCard }).map((_, rowIdx) => (
              <div
                key={`perm-skel-row-${slotKey(cardIdx)}-${slotKey(rowIdx)}`}
                className="px-4 py-3 border-b border-slate-100/80 last:border-b-0 grid grid-cols-1 md:grid-cols-[minmax(0,200px)_1fr_auto] gap-3 md:items-center"
              >
                <Skeleton width="w-32" height="h-3.5" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-16" rounded="rounded-lg" />
                  <Skeleton className="h-7 w-20" rounded="rounded-lg" />
                  <Skeleton className="h-7 w-20" rounded="rounded-lg" />
                  <Skeleton className="h-7 w-16" rounded="rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-10" rounded="rounded-lg" />
                  <Skeleton className="h-6 w-12" rounded="rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Skeleton;
