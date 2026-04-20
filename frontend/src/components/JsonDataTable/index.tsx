import { Table } from "antd";
import React, { useMemo } from "react";
import { IJsonTableData } from "./JsonTable.model";
import { ColumnType } from "antd/lib/table";

function JsonDataTable(props: IJsonTableData) {
  const { title, dataSource} = props;

  const columns: ColumnType<object>[] = useMemo(() => {
    return  dataSource.length > 0
    ? Object.keys(dataSource[0]).map((d) => {
        return {
          title: d,
          dataIndex: d,
        };
      })
    : [];
  }, [dataSource]);
  
  return (
    <div className="lead-history">
      <h1>{title}</h1>
      <Table
        columns={columns || []}
        pagination={false}
        dataSource={dataSource || []}
      />
    </div>
  );
}

export default JsonDataTable;
