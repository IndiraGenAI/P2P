import { UserRolesDepartment } from "src/services/user/user.model";

export interface IUserRecord {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status?: string;
  id: number;
  key?: string;
  roles: IUserRolesArry[];
  user_roles?: IUserRolesArry[];
}
export interface IUserRolesArry {
  id: number | null;
  status?: boolean | null;
  zone: {
    name: string;
    code: string;
    id: number | null;
  };
  role: {
    name: string;
    id: number | null;
  };
  availability?: string;
  zone_id?: number;
  role_id?: number;
  user_id?: number;
  user_role_courses?: IUserRoleCourses[];
  user_role_departments?:UserRolesDepartment[]
  user_role_color?: string;
  availability_time?:number[] | string;
}

export interface IUserRoleCourses {
  id: number;
  course_id: number;
  subcourse_id: number;
  user_role_id: number;
  course: ICourse;
  subcourse: ISubCourse;
}

export interface ICourse {
  id: number;
  name: string;
  code: string;
  status?: boolean;
  subcourses?: ISubCourse[];
}

export interface ISubCourse {
  id: number;
  name?: string;
  code: string;
  course_id: number;
  status?: boolean;
}

export interface ISubDepartment {
  id: number;
  name?: string;
  code: string;
  department_id: number;
  courses?: ICourse[];
}
export interface IStatus {
  key: string;
}

export interface IStatus {
  key: string;
}
