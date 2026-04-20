import { IMetaProps } from "src/components/Pagination/Pagination.model";
import { ISubDepartment } from "src/pages/User/Users.model";

export interface Idepartment {
  rows: IDepartmentDetails[];
  meta: IMetaProps;
}

export interface IDepartmentDetails {
  id: number;
  name: string;
  code: number;
  status: boolean;
  branch_departments: IBranch_id[];
  photos: boolean;
  tenthMarksheet: boolean;
  twelfthMarksheet: boolean;
  leavingCerty: boolean;
  adharCard: boolean;
  other: boolean;
  subdepartments?: ISubDepartment[];
}
export interface IDepartmentOnchange {
  id: number;
  branch_id: number[];
  department_id: number;
}

export interface IDepartmentStatus {
  id: number;
  status?: boolean;
}
export interface IBranch_id {
  branch_id: number;
  branch: {
    id: number;
    name: string;
    code:string;
    zone?:{parent_id:number | undefined}
    status: boolean;
  };
}
