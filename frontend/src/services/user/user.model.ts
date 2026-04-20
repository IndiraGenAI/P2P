import { IMetaProps } from "src/components/Pagination/Pagination.model";
import { IZoneDetails } from "../zone/zone.model";
import { IRoleDetails } from "../role/role.model";
import { IUserRoleCourses } from "src/pages/User/Users.model";

export interface IUser {
  rows: IUserData[];
  meta: IMetaProps;
}
export interface IUserData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  status?: string;
  id: number;
  user_roles?: IUserRole[];
  user: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone: string;
    status?: string;
    id: number;
    user_roles?: IUserRole[];
  };
}

export interface IuserName {
  id: number;
  first_name: string;
  last_name: string;
}

export interface IUserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  hash?: string;
  phone: string;
  last_seen?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: number | null;
  updated_by?: number | null;
  status?: string;
  user_roles: IUserRole[];
  menu?: [];
  role_permissions?: [];
}
export interface IUserStatus {
  id: number;
  status?: string;
}

export interface IUserRole {
  id: number;
  user_id: number;
  role_id: number;
  zone_id: number;
  zone: IZoneDetails;
  role: IRoleDetails;
  zoneWiseUser?: IUserRoleData[];
  status?: boolean;
  user_role_color?: string;
  user_role_departments?: UserRolesDepartment[];
  user_role_courses?: IUserRoleCourses[];
  availability_time?: number[];
}

export interface IUserRoleData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    status: string;
  };
  role: {
    id: number;
    name: string;
  };
}
export interface IUserConfig {
  id: number;
  UserConfig: UserConfig[];
}

export interface UserConfig {
  id: number;
  availability: string;
  reporting_user_id: number;
  UserRolesDepartment: UserRolesDepartment[];
  UserRolesCourse: UserRolesCourse[];
}

export interface UserRolesDepartment {
  id: number;
  department_id: number;
  department: {
    id: number;
    name: string;
    subdepartments: { id: number; name: string }[];
  };
  sub_department_ids?: string;
}

export interface UserRolesCourse {
  id: number;
  course_id: number;
}
export interface FacultyUtilization {
  branch_id: number;
  name: string;
  utilization_percentage: number;
  code: string;
}

export interface IFacultyUtilizationFilters {
  branchIds: number[];
  zoneIds: number[];
}

export interface FacultyWiseLecture {
  id: number;
  name: string;
  count: number;
  user_color: string;
}
export interface IGetFacultyWiseLectureCount {
  rows: FacultyWiseLecture[];
}

export interface IGetFacultyWiseLectureCountFilters {
  branchIds?: number[];
}
