import type { IDepartmentList } from "src/services/department/department.model";

export interface IDepartmentMasterState {
  departmentsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IDepartmentList;
  };
  createDepartment: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
