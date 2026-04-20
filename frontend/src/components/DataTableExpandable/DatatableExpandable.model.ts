import { ColumnsType } from "antd/es/table";
import { IMetaProps } from "../Pagination/Pagination.model";

export interface IDataTableExpandableProps {
  columns: ColumnsType<any>;
  loading: boolean;
  dataSource: object[];
  meta?: IMetaProps;
  expanrowData?: any;
  isexpandable?: any;
  rowSelection?: any;
  pagination?:PaginationConfig
}

type PaginationConfig = {
  current: number;
  defaultPageSize: number;
  pageSizeOptions: string[];
  showSizeChanger: boolean;
  showTotal: (total: number, range: [number, number]) => string;
  onChange: (page: number, pageSize: number) => void;
  onShowSizeChange: (current: number, size: number) => void;
};