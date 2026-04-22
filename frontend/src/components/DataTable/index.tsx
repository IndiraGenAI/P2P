import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import type { SorterResult, FilterValue } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

interface TableComponentProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  meta?: IMetaProps;
}

/**
 * Thin wrapper around antd Table that:
 *  - reads pagination + sort state from URL search params (skip/take/orderBy/order)
 *  - writes them back when the user changes page/size/sort, so reloads + share
 *    links preserve table state.
 *
 * Designed to plug directly into pages that already dispatch list actions
 * keyed off the URL search string.
 */
const TableComponent = <T extends object>({
  columns,
  dataSource,
  loading,
  meta,
}: TableComponentProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const take = Number(searchParams.get('take')) || meta?.take || 10;
  const skip = Number(searchParams.get('skip')) || 0;
  const current = Math.floor(skip / take) + 1;

  const handleChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    const sp = new URLSearchParams(searchParams.toString());
    const nextTake = pagination.pageSize ?? take;
    const nextSkip = ((pagination.current ?? 1) - 1) * nextTake;
    sp.set('take', String(nextTake));
    sp.set('skip', String(nextSkip));

    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    if (single?.order && single.field) {
      sp.set('orderBy', String(single.field));
      sp.set('order', single.order === 'ascend' ? 'ASC' : 'DESC');
    } else {
      sp.delete('orderBy');
      sp.delete('order');
    }

    setSearchParams(sp);
  };

  return (
    <Table<T>
      rowKey={(row) => String((row as { id?: number | string }).id ?? Math.random())}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onChange={handleChange}
      pagination={{
        current,
        pageSize: take,
        total: meta?.itemCount ?? dataSource.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '25', '50', '100'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default TableComponent;
