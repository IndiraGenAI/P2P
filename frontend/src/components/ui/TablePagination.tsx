import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select } from '@/components/ui/Select';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

interface TablePaginationProps {
  meta?: IMetaProps;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const TablePagination = ({
  meta,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: TablePaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const take =
    Number(searchParams.get('take')) || meta?.take || defaultPageSize;
  const skip = Number(searchParams.get('skip')) || 0;
  const itemCount = meta?.itemCount ?? 0;
  const page = Math.floor(skip / take) + 1;
  const totalPages = Math.max(1, meta?.pageCount ?? Math.ceil(itemCount / take));
  const fromIndex = itemCount === 0 ? 0 : skip + 1;
  const toIndex = Math.min(skip + take, itemCount);

  const sizeOptions = useMemo(
    () => pageSizeOptions.map((n) => ({ value: String(n), label: String(n) })),
    [pageSizeOptions],
  );

  const setUrl = (nextTake: number, nextSkip: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('take', String(nextTake));
    sp.set('skip', String(Math.max(0, nextSkip)));
    setSearchParams(sp);
  };

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setUrl(take, (clamped - 1) * take);
  };

  const onPageSizeChange = (value: string) => {
    const nextTake = Number(value) || defaultPageSize;
    setUrl(nextTake, 0);
  };

  return (
    <div
      className={
        'px-6 py-4 flex items-center justify-between flex-wrap gap-4 flex-shrink-0 border-t border-gray-100 bg-white' +
        (className ? ` ${className}` : '')
      }
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <Select
            value={String(take)}
            onChange={onPageSizeChange}
            options={sizeOptions}
            size="sm"
            fullWidth={false}
            className="w-20"
          />
          <span>entries</span>
        </div>
        <p className="text-sm text-gray-500">
          Showing {fromIndex} to {toIndex} of {itemCount} entries
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
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
          onClick={() => goToPage(page + 1)}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 soft-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
