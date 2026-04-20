import { IMetaProps } from "src/components/Pagination/Pagination.model";
import {
  BatchFacultyAttendances,
  TemplateShiningSheetTopic,
} from "./UserWiseBatch.model";
import {
  IBatchStudentMarks,
  StudentDetails,
} from "../StudentsMarks/studentMarks.Model";

export interface IStudentRecord {
  id: number;
  batch_id: string;
  admission_id: number;
  admission: IAdmission;
  subcourse_status: string;
  status?: string;
  is_remark_added?: boolean;
  is_15day_remark?: boolean
}

export interface IAdmission {
  batch_id: number;
  id: number;
  created_date: string;
  email: string;
  first_name: string;
  gr_id: Number;
  last_name: string;
  middle_name: string;
  mobile_no: string;
  father_mobile_no: string;
  father_name: string;
  branch_id: number;
  status: string;
}

export interface studentData {
  rows: IStudentRecord[];
  meta: IMetaProps;
}
export interface IBatchStudentAttendance {
  is_present: boolean;
  feedback: string;
  batch_singing_sheet_id: number;
  admission_id: number;
  batch_faculty_attendance_id: number;
}
export interface IstudentBatchRes {
  admission_id: number;
  batch_id: number;
  id: number;
  subcourse_status: string;
  admission: {
    batchStudentAttendances: IBatchStudentAttendance[];
  };
}

export interface IBatch {
  id: number;
  name: string;
  Batch_student_marks?: StudentDetails[];
}
export interface IBatchShiningSheet {
  id: number;
  batch_id: number;
  parent_id: number;
  name: string;
  description: string;
  sequence: string;
  duration: string;
  marks: number;
  planned_start_date: string;
  planned_end_date: Date;
  type: string;
  created_date: Date;
  created_by: string;
  updated_date: Date;
  updated_by: string;
  actual_date: Date;
  notes?: string;
  batchFacultyAttendances?: BatchFacultyAttendances[];
}
export interface IBatchShiningSheetDetails {
  id: number;
  batch: IBatch;
  batchSingingSheets: IBatchShiningSheet[];
  batch_id: number;
  duration: string;
  marks: number;
  name: string;
  planned_end_date: Date;
  planned_start_date: Date;
  sequence: string;
  type: string;
  submission_link?: string | null;
  Batch_student_marks?: IBatchStudentMarks[];
}

export interface IStudentShiningSheetDetails {
  rows: IBatchShiningSheetDetails[];
  meta: IMetaProps;
}

export interface IFacultyAttendanceDetails {
  id: number;
  batch_singing_sheet_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  type: string;
  actual_date: Date;
  created_by: number;
  created_date: Date;
  updatedBy: string;
  updated_date: Date;
}

export interface IStudentActualDateAndPresent {
  actual_date_new: Date[];
  attedance_start_time: number[]; 
  present_absent: boolean[];
  feedback: IFeedBack[];
  batch_singing_sheet_id: number;
  auto_feedback: number;
}

export interface IFeedBack {
  feedback: string;
  is_auto: boolean;
}

export interface IStudentAttendanceResponse {
  id: number;
  admission_id: number;
  batch_faculty_attendance_id: number;
  batch_singing_sheet_id: number;
  is_present: boolean;
  feedback: string;
  remarks: string;
  created_by: string;
  created_date: Date;
  updated_by: string;
  updated_date: string;
  batchFacultyAttendance: IFacultyAttendanceDetails;
  newData: IStudentActualDateAndPresent;
}

export interface IStudentDetailsProps {
  setbatchWiseStudentDetailsModal: (values: boolean) => void;
  batchWiseStudentDetailsModal?: boolean;
  batchWiseStudentData: studentData;
  onNextStudentAttendence: (values: any) => void;
  studentCount: number;
}

export interface IStudentListProps {
  setbatchWiseStudentListModal: (values: boolean) => void;
  batchWiseStudentListModal?: boolean;
  StudentData: studentData;
}
export interface ILocationData {
  data: TemplateShiningSheetTopic[];
  type: string;
  topicData: {
    questionBank?: number;
    name: string;
    subTopics: [{ description: string }];
    type: string;
    marks: number;
    duration: number;
  };
  isCAndDLecture: boolean;
  batch_page_url ?: string;
}

export interface IBatchStudentAttendenceProps {
  admission_id?: number;
  batch_singing_sheet_id?: number;
  batch_faculty_attendance_id?: number;
  is_present?: boolean;
  feedback?: string;
  remarks?: string;
}

export interface IFacultyStudentAttendenceProps {
  batch_singing_sheet_id?: number;
  user_id?: number | null;
  actual_date?: string | Date | undefined;
  start_time?: string | undefined | number;
  end_time?: string | undefined | number;
  type?: string;
  IBatchStudentAttendenceProps?: IBatchStudentAttendenceProps[] | undefined;
  shining_sheet_topics?: [];
  id?: number;
  status?: boolean;
}

export interface IBatchAssignedStudentCourseStatus {
  id?: number;
  batches_status?: string;
}

export interface IBatchesStatus {
  key: string;
}

export interface IStudentByBatchProps {
  batch_id: number;
  id: number;
}
export interface IStudentAttendenceValue {
  admissionId: admissionIdValue[];
  status: statusValue[];
  studentRemarks: studentRemarksValue[];
}

export interface IStudentAttendenceTimeAdd {
  start_time?: string;
}

export interface admissionIdValue {
  admission_id: number;
}
export interface statusValue {
  status: boolean;
  admission_id: number;
}
export interface studentRemarksValue {
  remarks: string;
  admission_id: number;
}

export interface IStudentDetailsRecord extends IBatchStudentAttendance {
  id: number;
  admission_id: number;
  batch_faculty_attendance_id: number;
  batch_singing_sheet_id: number;
  is_present: boolean;
  feedback: string;
  remarks?: string;
  created_by?: string;
  created_date?: Date;
  updated_by?: string;
  updated_date?: string;
}

export interface AdmissionRemarks {
  admission_id: number;
  remarks: string;
}

export interface IStudentAttendancePayload {
  is_present?: boolean;
  is_weekly_scedule?: boolean;
  remarks?: string | undefined;
  admission_id: number;
}

export interface IStudentAttendance {
  batch_singing_sheet_id?: number;
  user_id?: number | null;
  actual_date?: string | Date | undefined;
  start_time?: string | undefined | number;
  end_time?: string | undefined | number;
  type?: string;
  batch_student_attendances: IStudentAttendancePayload[];
}

export interface IStartBatchModelData {
  id?: number;
  batches_status?: string;
}