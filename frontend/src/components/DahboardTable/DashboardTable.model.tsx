import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { IMetaProps } from "../Pagination/Pagination.model";
import { PerformanceRange } from "src/services/studentList/studentList.model";
import { Moment } from "moment";
import { IDashboardTablesSort } from "src/pages/Dashboard/Dashboard.model";
import { Dispatch, SetStateAction } from "react";

export interface IDashboardTableProps {
  columns: ColumnsType<[]>;
  csvColumns?: CsvColumn[];
  className?: string;
  loading: boolean;
  dataSource: object[];
  meta?: IMetaProps;
  status?: (data: string[]) => void;
  facultyFilterShow?: boolean;
  rowSelection?: TableRowSelection<string>;
  rowKey?: string | undefined;
  count?: number;
  CardTitle: string | undefined;
  dataCount?: string | undefined;
  selectShow?: boolean;
  isCountShow?: boolean;
  showCreateCVBtn?: boolean;
  showPTMViewBtn?: boolean;
  showReportedCVList?: boolean;
  selectCardBatchName?: string | null;
  selectedBatch?: number | null | undefined;
  setSelectedBatch?: (data: number | null) => void;
  showBatchSelector?: boolean;
  url?: string | null;
  isFacultySelectShow?: boolean;
  setSelectedFaculty?: (data: number) => void;
  csvFileName?: string;
  isProjectTypeFilter?: boolean;
  setProjectType?: (data: string) => void;
  projectType?: string;
  setIsLinkSubmitted?: (data: boolean | string) => void;
  isLinkSubmitted?: boolean | string;
  setBranchFilter?: (data: number[]) => void;
  setZoneFilter?: (data: number[]) => void;
  showBatchFilter?: boolean;
  responsiveFilter?: boolean;
  isShowDateFilter?: boolean;
  showCreateESBtn?: boolean;
  showCreatePISBtn?: boolean;
  setStartDateAndEndDate_date?: (
    value: [Moment | null, Moment | null] | null
  ) => void;
  isShowDateDashboard?: boolean;
  isShowDateRange?: boolean;
  isStudentLowPerformanceFilter?: boolean;
  performanceRange?: PerformanceRange;
  setperformanceRange?: (data: PerformanceRange) => void;
  csvData?: object[];
  setSorter?: (values: IDashboardTablesSort) => void;
  fetchData?: (value: boolean|undefined) => void;
  lastElementRef?: Dispatch<SetStateAction<null>>;
}
export interface csvTableColumnType {
  label: string;
  key: string;
}
export interface CsvColumn {
  label: string;
  key: string;
}
