import { Table, TableProps, Skeleton } from "antd";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../Pagination";
import { IDataTableExpandableProps } from "./DatatableExpandable.model";

const TableExpandableComponent = (props: IDataTableExpandableProps) => {
  const {
    columns,
    dataSource,
    loading,
    meta,
    expanrowData,
    rowSelection,
    isexpandable,
    pagination,
  } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange: TableProps<any>["onChange"] = (
    _pagination,
    _filters,
    sorter: any
  ) => {
    const order =
      sorter.order === "ascend"
        ? "ASC"
        : sorter.order === "descend"
        ? "DESC"
        : undefined;
    const orderBy = sorter.field;

    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("skip", "0");

    if (order && orderBy) {
      newParams.set("orderBy", orderBy);
      newParams.set("order", order);
    } else {
      newParams.delete("orderBy");
      newParams.delete("order");
    }
    setSearchParams(newParams);
  };

  const locale = {
    emptyText: loading && <Skeleton paragraph={{ rows: 20 }} active={true} />,
  };

  return (
    <>
      <div className="table-bg">
        <Table
          className="gx-table-responsive table-striped"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={!loading ? dataSource : []}
          // loading={loading}
          onChange={pagination ? undefined : onChange}
          sortDirections={["ascend", "descend"]}
          pagination={pagination ? pagination : false}
          expandedRowRender={expanrowData}
          rowKey={(record) => record?.key || record.id}
          expandable={isexpandable}
          locale={locale}
        />
      </div>
      <div className="pagination">
        {meta && meta.itemCount > 0 && (
          <PaginationComponent
            meta={
              meta
                ? meta
                : {
                    take: 0,
                    itemCount: 0,
                    pageCount: 0,
                    hasPreviousPage: false,
                    hasNextPage: false,
                  }
            }
          />
        )}
      </div>
    </>
  );
};

export default TableExpandableComponent;
