import { IMetaProps } from "src/components/Pagination/Pagination.model";
import {
  IDepartmentRecord,
  IBranch,
} from "src/pages/Department/Department.model";
import { ISubdepartmentRecord } from "src/pages/SubDepartment/Subdepartment.model";
import { ISubCourse } from "src/pages/User/Users.model";

export interface Icourse {
  rows: ICourseDetails[];
  meta: IMetaProps;
}

export interface ICourseDetails {
  id: number;
  name: string;
  code: string;
  department_id: number;
  status?: boolean;
  department?: IDepartmentRecord;
  subDepartment?: ISubdepartmentRecord;
  subdepartment_id?: number;
  branch_courses?: IBranch[];
  branch_id?: number;
  subcourses?: ISubCourse[];
}
export interface ICourseDetailsById {
  id?: number;
  name?: string;
  status?: boolean;
  course?: {
    name: string;
    id: number;
  };
}

export interface ICourseStatus {
  id: number;
  status?: boolean;
}
export interface ICourseDetailsNew {
  id: number;
  name: string;
  code: string;
  department_id: number;
  status?: boolean;
  department?: IDepartmentRecord;
  subDepartment?: ISubdepartmentRecord;
  subdepartment_id?: number;
  branch_courses?: IBranch[];
  branch_id?: number;
  subcourses?: [];
}
