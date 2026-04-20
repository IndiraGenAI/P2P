import {
  Idepartment,
} from "../../services/departments/departments.model";

export interface IDepartmentState {
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };

  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };

  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  createDepartments: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  departmentsData: {
    data: Idepartment;
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
}
