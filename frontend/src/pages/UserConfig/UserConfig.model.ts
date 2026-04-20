export interface IUserConfifRecord {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status?: string;
  id: number;
  key?: string;
  user_roles: IConfigUserData[];
}
export interface ISelectDepartment {
  id?: number | null;
  name?: string;
  department_id?: number;
  department?: { id: number | null; department_id: number };
  subdepartment_ids?: string
}
export interface ISelectCourse {
  id?: number | null;
  name?: string;
  course_id?: number;
  course?: { id: number | null; course_id: number };
  subcourse_id?: number ;
}

export interface ISelectSubCourse {
  id?: number | null;
  name?: string;
  course_id?: number;
  subcourse_id?: number;
  subcourse?: { id: number | null; subcourse_id: number };
}
export interface ISelectReportingPerson {
  id: number;
  fName: string;
  lName: string;
  role: string;
}

export interface IColumnData {
  department_id: number;
}

export interface IConfigData {
  user_config: IUserConfigData[];
}

export interface IUserConfigData {
  id: number;
  availability: string;
  reporting_user_id: number;
  user_role_departments: IDepartmentData[];
  user_role_subdepartments: number[]
  user_role_courses: ICourseData[];
  user_role_subcourses?: number[];
  availability_time?:number[]

}
export interface ICourseData {
  course?: { id: number | null; course_id: number };
  id?: number | null;
  course_id?: number;
  subcourse_id?:number;
}
export interface ISubDepartmentData {
  subdepartment?: { id: number | null; subdepartment_id: number };
  id?: number | null;
  subdepartment_id?: number;
}
export interface ISubCourseData {
  id?: number | null;
  course_id?: number;
  subcourse_id?:number;
}

export interface IDepartmentData {
  department?: { id: number | null; department_id: number };
  id?: number | null;
  department_id?: number;
  sub_department_ids?: string 
}

export interface IConfigUserData {
  availability?: string;
  id?: number;
  reporting_user_id?: number;
  role: Role;
  user_id: number;
  user_role_courses: ICourseData[];
  user_role_departments: IDepartmentData[];
  user_role_subdepartments: ISubDepartmentData[]
  user_role_subcourses: number[];
  availability_time:string;
  zone?: { name?: string; id: number; type?: string; parent_id: number; branches: IBranchValue[] };
}

export interface IBranchValue {
  id: number;
  code: string;
}
export interface Role {
  id?: number;
  name?: string;
  type?: string;
}
