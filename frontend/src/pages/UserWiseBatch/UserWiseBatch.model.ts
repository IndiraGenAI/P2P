import { IMetaProps } from "src/components/Pagination/Pagination.model";
import { StudentDetails } from "../StudentsMarks/studentMarks.Model";
import { IQuestionBank } from "../SubcourseQuestionBank/QuestionBank.model";

export interface ILevel {
  batches_status: string;
  count: number;
}
export interface TemplateShiningSheetTopic {
  name?: string;
  id?: number;
  description?: string;
  sequence?: string | number;
  type?: string;
  status?: boolean;
  duration?: number | string;
  marks?: string | number;
  created_date?: string;
  sub_topics?: ISubtopics[];
  index?: number | string;
  batch?: IBatch;
  batch_singing_sheet_id?: number;
}
export interface batch_faculty_student_attendances {
  batch_faculty_student_attendances: TemplateShiningSheetTopic[];
  start_time?: string | undefined;
}

export interface BatchFacultyAttendances {
  id: number;
  batch_singing_sheet_id: number;
  user_id: number;
  actual_date: string;
  start_time: number;
  end_time: number;
  type: string;
  batchStudentAttendances: BatchStudentAttendances[];
}
export interface ISubtopics {
  id?: number;
  description: string;
  sequence: number;
  status: boolean;
  topic_sequence?: string;
  sub_topic_id?: number;
  index?: number | string;
  planned_start_date?: Date;
  batchFacultyAttendances?: BatchFacultyAttendances[];
  notes?: string;
  selected?: boolean;
}

export interface BatchStudentAttendances {
  id: number;
  batch_singing_sheet_id: number;
  batch_faculty_attendance_id: number;
  admission_id: number;
  is_present: boolean;
  remark: string;
  feedback: string | null;
  is_auto: boolean;
  examPaperStudents: IExamPaperStudents[];
}
export interface BatchFacultyAttendances {
  id: number;
  batch_singing_sheet_id: number;
  user_id: number;
  actual_date: string;
  start_time: number;
  end_time: number;
  type: string;
  batchStudentAttendances: BatchStudentAttendances[];
}

export interface FeedbackCount {
  batch_singing_sheet_id: number;
  count: number;
  feedback_a_count: number;
  feedback_b_count: number;
  feedback_c_count: number;
  feedback_d_count: number;
}

export interface IBatch {
  id: number;
  name: string;
  Batch_student_marks?: StudentDetails[]
}

export interface IBatchSingingSheets {
  rows: BatchSingingSheets[];
  meta: IMetaProps;
}

export interface BatchSingingSheets {
  id: number
  batch_id: number
  name: string
  description: string
  type: string
  duration: string
  marks: string
  planned_start_date: string
  exam_time_hours: string
  batch: IBatchData
  batchSingingSheets: IBatchSingingSheet[]
  Batch_student_marks: BatchStudentMark[]
  batch_signing_sheet_question_bank: IBatchSigningSheetQuestionBank
}

export interface IBatchData {
  id: number
  name: string
  subcourse_id: number
}

export interface IBatchSingingSheet {
  id: number
  name: string
  description: string
  type: string
  notes?: string
  duration: number
  marks: string
  planned_start_date: string
  batchFacultyAttendances: IBatchFacultyAttendance[]
  feedback: [];
}

export interface IBatchFacultyAttendance {
  id: number
  batch_singing_sheet_id: number
  actual_date: string
  start_time: string
  type: string
  batchStudentAttendances: IBatchStudentAttendance[]
}

export interface IBatchStudentAttendance {
  id: number
  admission_id: number
  batch_singing_sheet_id: number
  is_present: boolean
}

export interface BatchStudentMark {
  id: number
  admission_id: number
  marks: number
}

interface IBatchSigningSheetQuestionBank {
  id: number;
  batch_signing_sheet_id: number;
  question_bank_id: number;
  question_bank: IQuestionBank;
}

export interface IUserFilterDate {
  start_date: Date | string;
  end_date: Date | string;
  complete_start_date: Date | string;
  complete_end_date: Date | string;
}

export interface IStudentSigningSheet {
  is_my_batch?: boolean;
  is_absent_present?: boolean;
}

export interface CreateBatchSigningSheetTopic {
  batch_id: number;
  name: string;
  subTopics: [{ description: string }];
  marks: number;
  type: string;
  questionBank?: number;
  duration: number;
  planned_start_date: Date | string;
}
export interface IBatchSigningSheetTarget {
  value?: string;
}
export interface IBatchSigningSheetEvent {
  target?: IBatchSigningSheetTarget;
}
export interface IBulkRemark {
  labels: string;
  rating: string;
  remarks: string;
}
export interface IBulkRemarkDetails {
  labels: string;
  rating: string;
  remarks: string;
  student: {
    admission_id: number;
    admission: {
      branch_id: number;
    };
  };
}

export interface IBatchCompletedDetails {
  is_my_batch?: boolean;
}

export interface IMyTeamUserFilterDate {
  batchStart_start_date: Date | string;
  batchStart_end_date: Date | string;
  batchEnd_start_date?: Date | string;
  batchEnd_end_date?: Date | string;
  complete_start_date?: Date | string;
  complete_end_date?: Date | string;
  actual_academic_start_date?: Date | string;
  actual_academic_end_date?: Date | string;
}

export interface IExamPaperStudents {
  id: number;
  exam_paper_id: number | null;
  admission_id: number | null;
  batch_student_attendance_id: number | null;
  is_exam_submitted: boolean | null;
  created_by: string | null;
  created_date: Date | null;
  updated_by: string | null;
  updated_date: Date | null;
  obtain_marks: number | null;
}
