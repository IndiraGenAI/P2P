import { ColumnsType } from "antd/es/table";
import { GetRowKey, TableRowSelection } from "antd/lib/table/interface";
import { IMetaProps } from "../Pagination/Pagination.model";
import { IStudentRecord } from "src/pages/UserWiseBatch/BatchWiseStudentDetails.model";
import { IDashboardTablesSort } from "src/pages/Dashboard/Dashboard.model";
import { Dispatch, SetStateAction } from "react";
export interface IDataTableProps {
  columns: ColumnsType<any>;
  loading: boolean;
  dataSource: object[];
  meta?: IMetaProps;
  rowSelection?: TableRowSelection<string> | any;
  rowKey?: string | GetRowKey<any> | undefined;
  rowClassName?: (record: IStudentRecord, index: number) => string;
  summary?: (pageData: any) => React.ReactNode;
  setSorter?: (values: IDashboardTablesSort) => void
  lastElementRef?: Dispatch<SetStateAction<null>>;
}
