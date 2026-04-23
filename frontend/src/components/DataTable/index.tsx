import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SorterResult, FilterValue } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';
import PaginationComponent from '@/components/Pagination';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

interface TableComponentProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  meta?: IMetaProps;
  rowKey?: TableProps<T>['rowKey'];
  rowClassName?: TableProps<T>['rowClassName'];
}

const TableComponent = <T extends object>({
  columns,
  dataSource,
  loading,
  meta,
  rowKey,
  rowClassName,
}: TableComponentProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange: TableProps<T>['onChange'] = (
    _pagination,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;

    const sp = new URLSearchParams(searchParams.toString());
    sp.set('skip', '0');

    if (sorterObj?.order && sorterObj.field) {
      sp.set('orderBy', String(sorterObj.field));
      sp.set('order', sorterObj.order === 'ascend' ? 'ASC' : 'DESC');
    } else {
      sp.delete('orderBy');
      sp.delete('order');
    }

    setSearchParams(sp);
  };

  return (
    <>
      <div className="table-bg">
        <Table<T>
          rowKey={
            rowKey ??
            ((row) =>
              String((row as { id?: number | string }).id ?? Math.random()))
          }
          columns={columns}
          dataSource={!loading ? dataSource : []}
          onChange={onChange}
          sortDirections={['ascend', 'descend']}
          pagination={false}
          rowClassName={rowClassName}
          scroll={{ x: 'max-content' }}
        />
      </div>
      <div className="pagination">
        {meta && meta.itemCount > 0 && <PaginationComponent meta={meta} />}
      </div>
    </>
  );
};

export default TableComponent;
