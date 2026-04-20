import { ColumnsType } from "antd/lib/table";
import { IDashboardTableProps } from "../DahboardTable/DashboardTable.model";
import { IAdmissionRecurringData } from "src/services/students/student.model";

export interface IDashboardLazyLoad extends Partial<IDashboardTableProps> {
  dispatchFunction: (
    data: IDispatchPayload
  ) => Promise<IAdmissionRecurringData>;
  columns: ColumnsType<[]>;
  loading: boolean;
  loadCount?: number;
  cardTitle: string | undefined;
  gr_id?: number;
  ptmStatusType?: string;
}

export interface IDispatchPayload {
  take: number;
  skip: number;
  zoneIds?: string | null;
  branchIds?: string | null;
  facultyId?: number | null;
  batchId?: number | null;
  status?: string;
  gr_id?: number | null;
}
