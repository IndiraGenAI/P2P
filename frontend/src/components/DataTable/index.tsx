import { Skeleton, Table, TableProps } from "antd";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../Pagination";
import { IDataTableProps } from "./Datatable.model";

const TableComponent = (props: IDataTableProps) => {
  const {
    columns,
    dataSource,
    loading,
    meta,
    rowSelection,
    rowKey,
    rowClassName,
    summary,
    setSorter,
    lastElementRef,
  } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;

    let data = {
      order:
        sorterObj.order === "ascend"
          ? "ASC"
          : sorterObj.order === "descend"
          ? "DESC"
          : "",
      orderBy: sorterObj.field,
    };

    if (setSorter && data.order && data.orderBy) {
      setSorter({ order: data.order, orderBy: String(data.orderBy) });
    }

    const newUrl = new URLSearchParams(searchParams.toString());
    newUrl.set("skip", "0");

    if (data.order && data.orderBy) {
      newUrl.set("orderBy", String(data.orderBy));
      newUrl.set("order", data.order);
    } else {
      newUrl.delete("orderBy");
      newUrl.delete("order");
    }
    setSearchParams(newUrl);
  };

  const locale = {
    emptyText: loading && <Skeleton paragraph={{ rows: 20 }} active={true} />,
  };

  return (
    <>
      <div className="table-bg">
        <Table
          className="table-striped"
          columns={columns}
          dataSource={!loading ? dataSource : []}
          // loading={loading}
          rowSelection={rowSelection}
          onChange={onChange}
          sortDirections={["ascend", "descend"]}
          pagination={false}
          rowKey={rowKey}
          rowClassName={rowClassName}
          summary={summary}
          locale={locale}
          onRow={(_, index) => {
            if (index === dataSource.length - 11 && lastElementRef) {
              return {
                ref: lastElementRef,
              };
            }
            return {
              onClick: () => {},
            };
          }}
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

export default TableComponent;
