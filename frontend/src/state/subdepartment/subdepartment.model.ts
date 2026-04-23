import type { ISubdepartmentList } from "src/services/subdepartment/subdepartment.model";

export interface ISubdepartmentMasterState {
  subdepartmentsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ISubdepartmentList;
  };
  createSubdepartment: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
