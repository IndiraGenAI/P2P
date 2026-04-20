import { Moment } from "moment";
import { ReactNode } from "react";
import { IFacultyData } from "src/pages/CompanyVisitUpdateCard/CompanyVisit.model";
import { SliderSingleProps } from "antd";
import { PerformanceRange } from "src/services/studentList/studentList.model";

export interface IDashboardFilterProps {
  CardTitle: string | undefined;
  setBranchFilter?: (data: number[]) => void;
  setZoneFilter?: (data: number[]) => void;
  selectShow?: boolean;
  selectedOption?: string[];
  handleChange?: (value: string[]) => void;
  isProjectTypeFilter?: boolean;
  projectType?: string;
  handleProjectTypeChange?: (value: string) => void;
  handleLinkSubmitted?: (value: boolean | string) => void;
  projectOption?: ReactNode;
  batchStatusOption?: ReactNode;
  facultyData?: IFacultyData[];
  handleFacultyChange?: (value: number) => void;
  handleSubcourseChange?: (value: number) => void;
  handleSubdepartmentChange?: (value: number) => void;
  handleBatchName?: (value: number) => void;
  isShowDateFilter?: boolean;
  showBatchFilter?: boolean;
  setInstallment_date?: (value: [Moment | null, Moment | null] | null) => void;
  isBranchFilter?: boolean;
  facultyFilterShow?: boolean;
  isUserStatusWiseFilter?: boolean;
  finalUserData?: [{ subcourseData: ISelectCourseData[] }];
  matchedSubdepartments?: ISubDepartmentData[];
  handleUserStatus?: (value: string) => void;
  isStudentLowPerformanceFilter?: boolean;
  performanceRanges?: Array<{
    label: string;
    value: string;
  }>;
  handleRangeChange?: (value: string) => void;
  rangeFilter?: SliderSingleProps["marks"];
  handleRangeFilter?: (data: PerformanceRange) => void;
  responsiveFilter?: boolean;
  fetchData?: (value: boolean | undefined) => void;
}

export interface IFilterFormSubmit {
  BatchName: number;
  BatchStatus: string[];
  BranchCode: number[];
  FacultyName: number;
  SubcourseName: number;
  SubdepartmentName: number;
  Zone: number[];
  ProjectType: string;
  installment_date: [Moment | null, Moment | null];
  PerformanceRange: string;
  range: PerformanceRange;
  UserStatus: string;
  is_link_submitted: boolean | string;
}

export interface ISubCourseData {
  banner: string | null;
  code: string;
  course_config_id: number;
  course_id: number;
  created_by: string;
  created_date: string;
  duration: string;
  id: number;
  installment: number;
  career_course: boolean;
  upskill_course: boolean;
  name: string;
  shining_sheet: string | null;
  status: boolean;
  total: number;
  updated_by: string | null;
  updated_date: string | null;
}

export interface ISubDepartmentData {
  id: number;
  name: string;
}

export interface ISelectCourseData {
  [key: string]: ISubCourseData[];
}
