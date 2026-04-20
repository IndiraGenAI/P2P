import { SliderMarks } from "antd/lib/slider";
import { ICheckStaus } from "../models/common";

export enum StoragePath {
  DEFAULT = "/",
  ADMISSION_DOCUMENTS_ASSETS = "AdmissionDocumentsAssets",
  BRANCH_ASSETS = "BranchAssets",
  NSDC_DOCUMENTS = "NSDCDocuments",
  NSDC_CERTIFICATE = "NSDC_CERTIFICATE",
  VENDOR_DOCUMENTS = "VendorDocuments",
}

export enum InstallmentStatusType {
  PAID = "PAID",
  UNPAID = "UNPAID",
  ADVANCE_PAID = "ADVANCE_PAID",
  CANCELLED = "CANCELLED",
}
export enum IgenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum UrlPath {
  CONCESSION = "/concession",
}
export enum Configurations {
  MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT = "MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT",
  ADVANCE_PAYMENT_CONCESSION = "ADVANCE_PAYMENT_CONCESSION",
  ADMISSION_SPOT_DISCOUNT_PERCENTAGE = "ADMISSION_SPOT_DISCOUNT_PERCENTAGE",
}

export enum AdmisionStatusType {
  ONGOING = "ONGOING",
  PENDING = "PENDING",
  HOLD = "HOLD",
  TERMINATED = "TERMINATED",
  TRANSFER = "TRANSFER",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export const ADMISSION_STATUS_ORDER = [
  AdmisionStatusType.ONGOING,
  AdmisionStatusType.PENDING,
  AdmisionStatusType.HOLD,
  AdmisionStatusType.TERMINATED,
  AdmisionStatusType.CANCELLED,
  AdmisionStatusType.COMPLETED,
  AdmisionStatusType.TRANSFER,
] as const;

export enum AdmisionSubStatusType {
  NEW = "NEW",
  WAITING = "WAITING",
  TO_BE_ASSIGNED = "TO_BE_ASSIGNED",
  REVISION = "REVISION",
  REGULAR = "REGULAR",
  PLACEMENT = "PLACEMENT",
  CERTIFICATE = "CERTIFICATE",
}

export enum BranchAdmissionStatusType {
  ALL = "All",
  ONGOING = "Ongoing",
  PENDING = "Pending",
  HOLD = "Hold",
  TERMINATED = "Terminated",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
}

export enum CourseCategoryStatusType {
  PACKAGE = "PACKAGE",
  SINGLE = "SINGLE",
}

export enum AdmisionTransferStatusType {
  INITIALIZE = "INITIALIZE",
  ABOT = "ABOT",
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
}

export enum PayementModeType {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  DD = "DD",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  ONLINE_PAYMENT = "ONLINE_PAYMENT",
  NEFT_IMPS = "NEFT/IMPS",
  PAYTM = "PAYTM",
  BANK_DEPOSIT = "BANK_DEPOSIT_(CASH)",
  CAPITAL_FLOA = "CAPITAL_FLOAT_(EMI)",
  GOOGLE_PAY = "GOOGLE_PAY",
  PHONE_PAY = "PHONE_PAY",
  BAJAJ_FINSERV = "BAJAJ_FINSERV_(EMI)",
  BHIM_UPI = "BHIM UPI_(INDIA)",
  INSTAMOJO = "INSTAMOJO",
  PAYPAL = "PAYPAL",
  RAZORPAY = "RAZORPAY",
  PETTY_CASH = "PETTY_CASH",
}

export enum FeeTypes {
  TUITION = "TUITION",
  MATERIAL = "MATERIAL",
  REGISTRATION = "REGISTRATION",
}

export enum AvailabilityType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  VISITOR = "VISITOR",
}

export enum LectureType {
  THEORY = "THEORY",
  LAB = "LAB",
  OFFICE = "OFFICE",
}

export enum Slot_Type {
  OCCUPY = "OCCUPY",
  UN_OCCUPY = "UN_OCCUPY",
  HOLD = "HOLD",
}

export class Common {
  static Actions = class Actions {
    public static readonly CAN_VIEW = "VIEW";
    public static readonly CAN_DELETE = "DELETE";
    public static readonly CAN_UPDATE = "UPDATE";
    public static readonly CAN_ADD = "ADD";
    public static readonly CAN_ASSIGN_PERMISSION = "ASSIGN_PERMISSION";
    public static readonly ADMISSION_BASIC_INFO = "ADMISSION_BASIC_INFO";
    public static readonly CAN_FULL_VIEW = "FULL_VIEW";
    public static readonly CAN_EXPORT_DATA = "EXPORT_DATA";
    public static readonly CAN_HOLD_BATCH = "HOLD_BATCH";
    public static readonly CAN_APPLY = "APPLY";
    public static readonly CAN_VIEW_ADMISSION_AMOUNT = "ADMISSION_AMOUNT";
  };

  static Modules = class Modules {
    public static readonly DASHBOARD = Object.freeze({
      DASHBOARD_TODAY_AND_OVER_ALL_COUNT: "DASHBOARD_TODAY_AND_OVER_ALL_COUNT",
      DASHBOARD_BATCHES: "DASHBOARD_BATCHES",
      DASHBOARD_PENDING_EXAM_VIVA_PROJECT:
        "DASHBOARD_PENDING_EXAM_VIVA_PROJECT",
      DASHBOARD_ABSENT_TODAY: "DASHBOARD_ABSENT_TODAY",
      DASHBOARD_CD_GRADES_STUDENT_LIST: "DASHBOARD_CD_GRADES_STUDENT_LIST",
      DASHBOARD_OVERDUE_BATCHES: "DASHBOARD_OVERDUE_BATCHES",
      DASHBOARD_LOW_ATTENDANCE_BELOW_NINETY_PERCENTAGE:
        "DASHBOARD_LOW_ATTENDANCE_BELOW_NINETY_PERCENTAGE",
      DASHBOARD_PTM_LIST: "DASHBOARD_PTM_LIST",
      DASHBOARD_BRANCH_LIST: "DASHBOARD_BRANCH_LIST",
      DASHBOARD_COMPANY_VISIT_LIST: "DASHBOARD_COMPANY_VISIT_LIST",
      DASHBOARD_REPORTED_COMPANY_VISIT_LIST:
        "DASHBOARD_REPORTED_COMPANY_VISIT_LIST",
      DASHBOARD_EXPERT_SESSION_LIST: "DASHBOARD_EXPERT_SESSION_LIST",
      DASHBOARD_REPORTED_EXPERT_SESSION_LIST:
        "DASHBOARD_REPORTED_EXPERT_SESSION_LIST",
      DASHBOARD_PLACEMENT_INTERVIEW_SESSION_LIST:
        "DASHBOARD_PLACEMENT_INTERVIEW_SESSION_LIST",
      DASHBOARD_REPORTED_PLACEMENT_INTERVIEW_SESSION_LIST:
        "DASHBOARD_REPORTED_PLACEMENT_INTERVIEW_SESSION_LIST",
      DASHBOARD_INCOME_COURSE: "DASHBOARD_INCOME_COURSE",
      DASHBOARD_REVENUE_COURSE: "DASHBOARD_REVENUE_COURSE",
      DASHBOARD_STUDENT_COUNT: "DASHBOARD_STUDENT_COUNT",
      DASHBOARD_REVENUE_BRANCH: "DASHBOARD_REVENUE_BRANCH",
      DASHBOARD_TODAY_COUNT: "DASHBOARD_TODAY_COUNT",
      DASHBOARD_OVER_ALL_COUNT: "DASHBOARD_OVER_ALL_COUNT",
      DASHBOARD_CONTINUOUSLY_FIFTEEN_DAYS_ABSENT:
        "DASHBOARD_CONTINUOUSLY_FIFTEEN_DAYS_ABSENT",
      DASHBOARD_FACULTY: "DASHBOARD_FACULTY",
      DASHBOARD_CANCELLED_AND_TERMINATED_STUDENT_ATTENDED_LECTURE:
        "DASHBOARD_CANCELLED_AND_TERMINATED_STUDENT_ATTENDED_LECTURE",
      DASHBOARD_BELOW_EIGHTY_PERCENTAGE_STUDENT_REPORT:
        "DASHBOARD_BELOW_EIGHTY_PERCENTAGE_STUDENT_REPORT",
      DASHBOARD_BRANCH_WISE_OVERDUE_INCOME:
        "DASHBOARD_BRANCH_WISE_OVERDUE_INCOME",
      DASHBOARD_AUTO_FEEDBACK: "DASHBOARD_AUTO_FEEDBACK",
    });

    public static readonly STATISTICS_DASHBOARD = Object.freeze({
      STATISTICS_TOTAL_AND_COMPLETION_ADMISSION_REPORT:
        "STATISTICS_TOTAL_AND_COMPLETION_ADMISSION_REPORT",
      STATISTICS_PACKAGE_REVENUE: "STATISTICS_PACKAGE_REVENUE",
      STATISTICS_BRANCH_WISE_AND_ADMISSION:
        "STATISTICS_BRANCH_WISE_AND_ADMISSION",
      STATISTICS_SUBCOURSE_REVENUE: "STATISTICS_SUBCOURSE_REVENUE",
      STATISTICS_RECORD_COUNT_BY_SUB_SECTOR:
        "STATISTICS_RECORD_COUNT_BY_SUB_SECTOR",
      STATISTICS_PAID_AMOUNT_BY_SUB_SECTOR:
        "STATISTICS_PAID_AMOUNT_BY_SUB_SECTOR",
      STATISTICS_BUDGET_BY_SUB_SECTOR: "STATISTICS_BUDGET_BY_SUB_SECTOR",
      STATISTICS_OVERDUE_INCOME_BRANCH_WISE:
        "STATISTICS_OVERDUE_INCOME_BRANCH_WISE",
      STATISTICS_SUB_SECTOR_NET_PAY: "STATISTICS_SUB_SECTOR_NET_PAY",
    });

    public static readonly USER_CONFIGURATION = Object.freeze({
      USER_CONFIGURATION: "USER_CONFIGURATION",
      USERS: "USERS_USERS",
      ROLES: "USERS_ROLES",
      DISABLE_USER: "DISABLE_USER",
      CONFIGURATION_LIST: "CONFIGURATION_LIST",
    });

    public static readonly MASTER = Object.freeze({
      MASTER: "MASTER",
      ZONES: "MASTER_ZONES",
      BRANCHES: "MASTER_BRANCHES",
      DEPARTMENTS: "MASTER_DEPARTMENTS",
      SUBDEPARTMENTS: "MASTER_SUBDEPARTMENTS",
      COURSES: "MASTER_COURSES",
      SUBCOURSES: "MASTER_SUBCOURSES",
      PACKAGES: "MASTER_PACKAGES",
      BATCHES: "MASTER_BATCHES",
      BATCH_STUDENT_VIEW: "BATCH_STUDENT_VIEW",
      SUBCOURSE_TOPIC: "MASTER_SUBCOURSE_TOPIC",
      TEMPLATE_SHINING_SHEET: "MASTER_TEMPLATE_SHINING_SHEET",
      CITY: "MASTER_CITY",
      AREA: "MASTER_AREA",
      HOLIDAY: "MASTER_HOLIDAY",
      REGENERATE_SYLLABUS_AND_PROGRESS_SHEET_VIEW:
        "MASTER_REGENERATE_SYLLABUS_AND_PROGRESS_SHEET",
      MASTER_BRANCH_INFRASTRUCTURE: "MASTER_BRANCH_INFRASTRUCTURE",
      MASTER_HARDWARE: "MASTER_HARDWARE",
      MASTER_SUBCOURSE_EXAM_QUESTION: "MASTER_SUBCOURSE_EXAM_QUESTION",
      MASTER_MERGE_BATCH: "MASTER_MERGE_BATCH",
      MASTER_QUESTION_BANK: "MASTER_QUESTION_BANK",
      MASTER_PC_TRACKING_VIEW: "MASTER_PC_TRACKING_VIEW",
      MASTER_BRANCH_WISE_COLLECTION_TARGET:
        "MASTER_BRANCH_WISE_COLLECTION_TARGET",
      MASTER_BRANCH_WISE_ADMISSION_TARGET:
        "MASTER_BRANCH_WISE_ADMISSION_TARGET",
      MASTER_HELP_SUPPORT_VIEW: "MASTER_HELP_SUPPORT_VIEW",
    });

    public static readonly ADMISSION = Object.freeze({
      ADMISSION: "ADMISSION",
      ADD_ADMISSION: "ADMISSION_ADD_ADMISSION",
      VIEW_ADMISSION: "ADMISSION_VIEW_ADMISSION",
      PENALTY_RECEIPT: "PENALTY_RECEIPT",
      TRANSFER_ADMISSION: "ADMISSION_TRANSFER_ADMISSION",
      OVERDUE_INCOME: "ADMISSION_OVERDUE_INCOME",
      CONCESSION: "ADMISSION_CONCESSION_VIEW",
      OUTSTANDING_INCOME: "ADMISSION_OUTSTANDING_INCOME",
      INCOME: "INCOME",
      ADMISSION_INCOME_RECEIPT_VIEW: "ADMISSION_INCOME_RECEIPT_VIEW",
      INCOME_CSV_FILE: "INCOME_CSV_FILE_VIEW",
      ADMISSION_BASIC_INFO: "ADMISSION_BASIC_INFO",
      ADMISSION_COURSE_INFO: "ADMISSION_COURSE_INFO",
      ADMISSION_COURSE_BATCH_ASSIGN: "ADMISSION_COURSE_BATCH_ASSIGN",
      ADMISSION_COURSE_AS_COMPLETED: "ADMISSION_COURSE_AS_COMPLETED",
      ADMISSION_PAYMENT_INSTALLMENTS_DETAILS:
        "ADMISSION_PAYMENT_INSTALLMENTS_DETAILS",
      ADMISSION_STATUS_CANCELLED_UPDATE: "ADMISSION_STATUS_CANCELLED_UPDATE",
      ADMISSION_STATUS_MARK_TERMINATED_UPDATE:
        "ADMISSION_STATUS_MARK_TERMINATED_UPDATE",
      ADMISSION_STATUS_HOLD_UPDATE: "ADMISSION_STATUS_HOLD_UPDATE",
      ADMISSION_COURSE_MODIFICATION: "ADMISSION_COURSE_MODIFICATION",
      ADMISSION_EDUCATION_DETAILS_INFO: "ADMISSION_EDUCATION_DETAILS_INFO",
      ADMISSION_POSTAL_COMMUNICATION_INFO:
        "ADMISSION_POSTAL_COMMUNICATION_INFO",
      ADMISSION_PARENT_DETAILS_INFO: "ADMISSION_PARENT_DETAILS_INFO",
      ADMISSION_STATUS_HOLD_OVER_VIEW: "ADMISSION_STATUS_HOLD_OVER_VIEW",
      ADMISSION_DOCUMENTS_DETAILS: "ADMISSION_DOCUMENTS_DETAILS",
      ADMISSION_REMARKS: "ADMISSION_REMARKS",
      ADMISSION_CHEQUE_LIST: "ADMISSION_CHEQUE_LIST",
      ADMISSION_CHEQUE_COMMENT_ADD: "ADMISSION_CHEQUE_COMMENT_ADD",
      ADMISSION_COURSE_ADMISSION_LETTER: "ADMISSION_COURSE_ADMISSION_LETTER",
      ADMISSION_MISSING_ADMISSION: "ADMISSION_MISSING_ADMISSION",
      ADMISSION_FEES_LETTER: "ADMISSION_FEES_LETTER",
      ADMISSION_INSTALLMENTS_REPORT: "ADMISSION_INSTALLMENTS_REPORT",
      ADMISSION_INSTALLMENT_MODIFY: "ADMISSION_INSTALLMENT_MODIFY",
      ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW:
        "ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW",
      CRM_MISSING_DETAILS_ADMISSION: "CRM_MISSING_DETAILS_ADMISSION",
      ADMISSION_REPORT_CSV_FILE_VIEW: "ADMISSION_REPORT_CSV_FILE_VIEW",
      ADMISSION_OUTSTANDING_INCOME_CSV_FILE_VIEW:
        "ADMISSION_OUTSTANDING_INCOME_CSV_FILE_VIEW",
      ADMISSION_OVERDUE_INCOME_CSV_FILE_VIEW:
        "ADMISSION_OVERDUE_INCOME_CSV_FILE_VIEW",
      ADMISSION_CRM_HISTORY: "ADMISSION_CRM_HISTORY",
      ADMISSION_REMARKS_LABEL: "ADMISSION_REMARKS_LABEL",
      ADMISSION_ACADEMIC_REMARKS_LABEL: "ADMISSION_ACADEMIC_REMARKS_LABEL",
      ADMISSION_CRM_LEAD_ENQUIRIES: "ADMISSION_CRM_LEAD_ENQUIRIES",
      ADMISSION_CONCESSION: "ADMISSION_CONCESSION",
      ADMISSION_AMOUNT: "ADMISSION_AMOUNT",
      ADMISSION_PENALTY: "ADMISSION_PENALTY",
      ADMISSION_SUB_STATUS_REVISION_UPDATE:
        "ADMISSION_SUB_STATUS_REVISION_UPDATE",
      ADMISSION_PAID_AMOUNT: "ADMISSION_PAID_AMOUNT",
      ADMISSION_PENDING_AMOUNT: "ADMISSION_PENDING_AMOUNT",
      ADMISSION_PAYABLE_AMOUNT: "ADMISSION_PAYABLE_AMOUNT",
      ADMISSION_PERFORMANCE_MODIFICATION_VIEW:
        "ADMISSION_PERFORMANCE_MODIFICATION_VIEW",
      ADMISSION_ATTENDANCE_VIEW: "ADMISSION_ATTENDANCE_VIEW",
      ADMISSION_NSDC_VIEW: "ADMISSION_NSDC_VIEW",
      ADMISSION_NSDC_HISTORY: "ADMISSION_NSDC_HISTORY",
      MOBILE_PHONE_ICON: "MOBILE_PHONE_ICON",
      WHATSAPP_ICON: "WHATSAPP_ICON",
      ADMISSION_GENERATE_CERTIFICATE: "ADMISSION_GENERATE_CERTIFICATE",
      ADMISSION_REQUEST_LIST: "ADMISSION_REQUEST_LIST",
      ADMISSION_STATUS_EDIT: "ADMISSION_STATUS_EDIT",
      ADMISSION_SUBCOURSE_EDIT: "ADMISSION_SUBCOURSE_EDIT",
      INSTALLMENT_EDIT: "INSTALLMENT_EDIT",
      ADMISSION_REQUEST_LIST_INSTALLMENT_MODIFICATION:
        "ADMISSION_REQUEST_LIST_INSTALLMENT_MODIFICATION",
      ADMISSION_REQUEST_LIST_ADMISSION_STATUS_CHANGE:
        "ADMISSION_REQUEST_LIST_ADMISSION_STATUS_CHANGE",
      ADMISSION_REQUEST_LIST_SUBCOURSE_STATUS:
        "ADMISSION_REQUEST_LIST_SUBCOURSE_STATUS",
    });

    public static readonly EXPENSE = Object.freeze({
      EXPENSE: "EXPENSE",
      EXPENSE_CSV_FILE: "EXPENSE_CSV_FILE_VIEW",
      CATEGORIES: "EXPENSE_CATEGORIES",
      SUBCATEGORIES: "EXPENSE_SUBCATEGORIES",
      EXPENSE_MASTER: "EXPENSE_MASTER",
      EXPENSE_EXPENSE: "EXPENSE_EXPENSE",
    });

    public static readonly ACADEMIC = Object.freeze({
      ACADEMIC: "ACADEMIC",
      ACADEMIC_USER_BATCH: "ACADEMIC_USER_BATCH",
      ACADEMIC_USER_BATCH_STUDENT_VIEW: "ACADEMIC_USER_BATCH_STUDENT_VIEW",
      ACADEMIC_USER_BATCH_ATTENDANCE_VIEW:
        "ACADEMIC_USER_BATCH_ATTENDANCE_VIEW",
      ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW:
        "ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW",
      ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW:
        "ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW",
      ACADEMIC_USER_BATCH_START_VIEW: "ACADEMIC_USER_BATCH_START_VIEW",
      ACADEMIC_UN_ASSIGN_BATCH_ADMISSION: "ACADEMIC_UN_ASSIGN_BATCH_ADMISSION",
      ACADEMIC_MY_TEAM_BATCHES_VIEW: "ACADEMIC_MY_TEAM_BATCHES_VIEW",
      ACADEMIC_TEAM_BATCH_MARKS_UPDATE: "ACADEMIC_TEAM_BATCH_MARKS_UPDATE",
      ACADEMIC_STUDENT_MARKS_VIEW: "ACADEMIC_STUDENT_MARKS_VIEW",
      ACADEMIC_BATCH_COMPLETED_VIEW: "ACADEMIC_BATCH_COMPLETED_VIEW",
      ACADEMIC_STUDENT_DETAILS_CSV_FILE_VIEW:
        "ACADEMIC_STUDENT_DETAILS_CSV_FILE_VIEW",
      ACADEMIC_FACULTY_SIGNING_SHEET_MODIFY:
        "ACADEMIC_FACULTY_SIGNING_SHEET_MODIFY",
      ACADEMIC_STUDENT_LIST: "ACADEMIC_STUDENT_LIST",
      ACADEMIC_REMARKS_LABEL: "ACADEMIC_REMARKS_LABEL",
      ACADEMIC_LAB_ASSIGN: "ACADEMIC_LAB_ASSIGN",
      ACADEMIC_ASSIGN_STUDENTS: "ACADEMIC_ASSIGN_STUDENTS",
      ACADEMIC_ASSIGN_QUESTION_BANK: "ACADEMIC_ASSIGN_QUESTION_BANK",
      ACADEMIC_EXAM: "ACADEMIC_EXAM",
      ACADEMIC_EXAM_LISTING: "ACADEMIC_EXAM_LISTING",
      ACADEMIC_EXAM_RESULT_PUBLISH: "ACADEMIC_EXAM_RESULT_PUBLISH",
      ACADEMIC_EXAM_CREATE: "ACADEMIC_EXAM_CREATE",
      ACADEMIC_CV_RANDOM_GENERATE: "ACADEMIC_CV_RANDOM_GENERATE",
      ACADEMIC_ES_RANDOM_GENERATE: "ACADEMIC_ES_RANDOM_GENERATE",
      ACADEMIC_PIS_RANDOM_GENERATE: "ACADEMIC_PIS_RANDOM_GENERATE",
      ACADEMIC_ATTENDANCE_VIEW: "ACADEMIC_ATTENDANCE_VIEW",
      ACADEMIC_CREDIT_LIST: "ACADEMIC_CREDIT_LIST",
    });

    public static readonly REPORT = Object.freeze({
      REPORT_COMPANY_VISIT: "REPORT_COMPANY_VISIT",
      REPORT_DEGRADE_AND_CANCELLATION_STUDENTS_REMARKS:
        "REPORT_DEGRADE_AND_CANCELLATION_STUDENTS_REMARKS",
      REPORT_EXPERT_SESSIONS: "REPORT_EXPERT_SESSIONS",
      REPORT_TOPIC_ANALYSIS: "REPORT_TOPIC_ANALYSIS",
      REPORT_PROJECT_ANALYSIS: "REPORT_PROJECT_ANALYSIS",
      LAB_REPORT: "LAB_REPORT",
      MISSING_ADMISSION_ANALYSIS: "MISSING_ADMISSION_ANALYSIS",
      FACULTY_AVAILABILITY_SCHEDULE: "FACULTY_AVAILABILITY_SCHEDULE",
      CD_GRADE_HISTORY: "CD_GRADE_HISTORY",
      COUNSELLORS_INFORMATION: "COUNSELLORS_INFORMATION",
      SCHOOL_WISE_STUDENT_COUNT: "SCHOOL_WISE_STUDENT_COUNT",
      TELLY_REPORT: "TELLY_REPORT",
      TELLY_REPORT_CSV: "TELLY_REPORT_CSV",
      EXAM_MARK_REPORT: "EXAM_MARK_REPORT",
      LAB_REPORT_HOLD_DELETE: "REPORT_LAB_HOLD_DELETE",
      REPORT_ACTIVE_STUDENT_LIST_VIEW: "REPORT_ACTIVE_STUDENT_LIST_VIEW",
      EXAM_MARK_CSV: "EXAM_MARK_CSV",
      REPORT_ADMISSION_TARGET_VS_ACHIEVEMENT:
        "REPORT_ADMISSION_TARGET_VS_ACHIEVEMENT",
      REPORT_COLLECTION_TARGET_VS_ACHIEVEMENT:
        "REPORT_COLLECTION_TARGET_VS_ACHIEVEMENT",
      REPORT_ADMISSION_COUNT_VIEW: "REPORT_ADMISSION_COUNT_VIEW",
      REPORT_MONTH_WISE_COLLECTION_REPORT_VIEW:
        "REPORT_MONTH_WISE_COLLECTION_REPORT_VIEW",
      REPORT_MONTH_WISE_WALK_IN_DONE: "REPORT_MONTH_WISE_WALK_IN_DONE",
      REPORT_PENDING_ATTENDANCE_COUNT: "REPORT_PENDING_ATTENDANCE_COUNT",
    });

    public static readonly NSDC = Object.freeze({
      NSDC_UNREGISTERED_STUDENT: "NSDC_UNREGISTERED_STUDENT",
      NSDC_REGISTERED_STUDENT: "NSDC_REGISTERED_STUDENT",
      NSDC_VERIFIED_STUDENT: "NSDC_VERIFIED_STUDENT",
      NSDC_BATCH: "NSDC_BATCH",
      NSDC_STUDENT_HISTORY: "NSDC_STUDENT_HISTORY",
      NSDC_STUDENT_FLAG_DELETE: "NSDC_STUDENT_FLAG_DELETE",
    });

    public static readonly RNW_CERTIFICATE = Object.freeze({
      ALL_STUDENT_CERTIFICATE: "ALL_STUDENT_CERTIFICATE",
    });

    public static readonly PLACEMENT = Object.freeze({
      PLACEMENT_PORTAL_LINK: "PLACEMENT_PORTAL_LINK",
    });

    public static readonly SUPER_PERMISSION = Object.freeze({
      SUPER_PERMISSION_UNBLOCK_FLOW: "SUPER_PERMISSION_UNBLOCK_FLOW",
    });
  };
}
export enum UserBatchStatusType {
  ONGOING = "ONGOING",
  UP_COMING = "UP_COMING",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  ALL = "ALL",
}

export enum SubCourseTopicTabType {
  TEMPLATED_TOPIC = "1",
  SUBCOURSE_TOPIC = "2",
}

export enum BranchInOutType {
  BRANCHIN = "1",
  BRANCHOUT = "2",
}

export const Admission_Installment_Cheque_Type: ICheckStaus = {
  TO_BE_DEPOSIT: {
    value: "TO_BE_DEPOSIT",
    label: "Deposited",
    className: "cheque-status deposited-cheque",
  },
  TO_BE_COLLECTED: {
    value: "TO_BE_COLLECTED",
    label: "Collected",
    className: "cheque-status collected-cheque",
  },
  TO_BE_BOUNCE: {
    value: "TO_BE_BOUNCE",
    label: "Bounced",
    className: "cheque-status bounced-cheque",
  },
  TO_BE_CLEARED: {
    value: "TO_BE_CLEARED",
    label: "Cleared",
    className: "cheque-status cleared-cheque",
  },
  TO_BE_CANCELED: {
    value: "TO_BE_CANCELED",
    label: "Cancelled",
    className: "cheque-status cancelled-cheque",
  },
};

export enum Exam_List {
  INITIALIZE = "INITIALIZE",
  PUBLISH = "PUBLISH",
  SELECTION = "SELECTION",
}

export enum ActionType {
  CREATE = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
  FULL_VIEW = "FULL_VIEW",
  EXPORT_DATA = "EXPORT_DATA",
  HOLD_BATCH = "HOLD_BATCH",
  ASSIGN_PERMISSION = "ASSIGN_PERMISSION",
}
export enum PresentAndAbsentType {
  Present = "P",
  Absent = "A",
}

export enum FeedBackType {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}
export enum RoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  FACULTY_HEAD = "FACULTY_HEAD",
  FACULTY = "FACULTY",
  MANAGER = "MANAGER",
  OPERATION_MANAGER = "OPERATION_MANAGER",
  SALES_MANAGER = "SALES_MANAGER",
  ACCOUNT_MANAGER = "ACCOUNT_MANAGER",
}

export enum ZoneType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}
export enum SessionType {
  REGULAR = "REGULAR",
  REVISION = "REVISION",
  REPEAT = "REPEAT",
  ADD_NEW_TOPIC = "ADD_NEW_TOPIC",
}

export const marks: SliderMarks = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
};

export enum PTM_STUDENT_REPORT_STATUS_TYPES {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum Relation_type {
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  SISTER = "SISTER",
  UNCLE = "UNCLE",
  AUNTY = "AUNTY",
  OTHER = "OTHER",
}

export enum Discipline_type {
  BAD = "BAD",
  MEDIUM = "MEDIUM",
  GOOD = "GOOD",
}

export enum Uniform_type {
  REGULAR = "REGULAR",
  IRREGULAR = "IRREGULAR",
}

export enum SubCourseTopicType {
  LECTURE = "LECTURE",
  PROJECT = "PROJECT",
  VIVA = "VIVA",
  EXAM_PRACTICAL = "EXAM_PRACTICAL",
  EXAM_THEORY = "EXAM_THEORY",
  ASSIGNMENT = "ASSIGNMENT",
}

export enum TopicType {
  LECTURE = "LECTURE",
  PROJECT = "PROJECT",
  VIVA = "VIVA",
  EXAM_PRACTICAL = "EXAM_PRACTICAL",
  EXAM_THEORY = "EXAM_THEORY",
  ASSIGNMENT = "ASSIGNMENT",
}

export enum QuestionBankType {
  EXAM_PRACTICAL = "EXAM_PRACTICAL",
  EXAM_THEORY = "EXAM_THEORY",
}

export enum Question {
  QUESTION = "QUESTION",
}

export enum QuestionType {
  MCQ = "MCQ",
  SUBJECTIVE = "SUBJECTIVE",
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum GrId {
  GRID = "GR ID - ",
}

export const EmailValidation = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
);

export enum Remarks_Labels {
  Fees = "FEES",
  General = "GENERAL",
  Studies = "STUDIES",
  Punctuality = "PUNCTUALITY",
  Discipline = "DISCIPLINE",
}

export enum admissionViewAndUnAssignAdmissionViewRemarks {
  VIEW_ADMISSION_REMARKS = "VIEW_ADMISSION_REMARKS",
  VIEW_UN_ASSIGN_ADMISSION_REMARKS = "VIEW_UN_ASSIGN_ADMISSION_REMARKS",
  VIEW_STUDENT_DETAILS_REMARKS = "VIEW_STUDENT_DETAILS_REMARKS",
}

export enum Admission_Recurring_type {
  PTM = "PTM",
  CV = "CV",
  ES = "ES",
  PIS = "PIS",
}

export const FeeType = {
  TUITION: 1,
  MATERIAL: 2,
  REGISTRATION: 3,
  OTHER_CHARGES: 4,
};

export const IncomeTypeLabel: Record<number, string> = {
  1: "Tuition",
  2: "Material",
  3: "Registration",
  4: "Other Charges",
};

export enum LazyLoadPageCount {
  twenty = 20,
  fifty = 50,
  hundred = 100,
}

export enum Admission_Recurring_status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum Dashboard_Card_Type {
  REPORT_CV_LIST = "Reported Company Visit List",
  CV_LIST = "Company Visit List",
  PTM_LIST = "PTM List",
  BATCHES = "Batches",
  ABSENT_TODAY = "Absent Today",
  LOW_ATTENDANCE = "Low Attendance (below 90%)",
  OVERDUE_BATCHES = "Overdue/Fast-Forward batches",
  CD_FEEDBACK_STUDENT_LIST = "C, D FeedBack Student List",
  PENDING_PROJECT = "Pending Exam,Viva & Project",
  BRANCH_LIST = "Branch List",
  REVENUE_COURSE = "Revenue Course",
  INCOME_SOURCE = "Income Source",
  REVENUE_BRANCH = "Revenue Branch",
  BRANCH_COLLECTION = "Branch Collection",
  EXPERT_SESSION_LIST = "Expert Session List",
  REPORTED_EXPERT_SESSION_LIST = "Reported Expert Session List",
  CONTINUOUSLY_ABSENT = "Continuously 15 Days Absent",
  PLACEMENT_INTERVIEW_SESSION_LIST = "Placement Interview Session List",
  REPORTED_PLACEMENT_INTERVIEW_SESSION_LIST = "Reported Placement Interview Session List",
  FACULTY_CARD = "Faculty",
  CANCEL_TERMINATED_STUDENT_LIST = "Cancel or Terminated Student",
  BELOW_EIGHTY_PERCENTAGE_STUDENT_REPORT = "Low Performance",
  OVERDUE_BRANCHES = "Overdue Branches",
  TOTAL_AUTO_FEEDBACK_CARD = "Today Auto Feedback",
}

export enum Dashboard_Batch_Type {
  PENDING_BATCH = "pendingSelectBatch",
  CD_FEEDBACK_BATCH = "cdFeedBackSelectBatch",
  ABSENT_BATCH = "absentSelectBatch",
  OVERDUE_BATCH = "overDueSelectBatch",
}
export enum Branch_Infrastructure_Type {
  OFFICE = "OFFICE",
  LAB = "LAB",
  THEORY = "THEORY",
}

export enum Url_Type {
  SHINING_SHEET = "shiningSheet",
  STUDENTS_MARKS = "StudentsMarks",
}

export enum Account_Dashboard_TodayCard {
  ONGOING = "Ongoing",
  PENDING = "Pending",
  TERMINATED = "Terminated",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
}
export enum AdmissionSubcourseGrade {
  A_PLUS = "A+",
  A = "A",
  B_PLUS = "B+",
  B = "B",
  C = "C",
  D = "D",
}

export enum AdmissionSubcourseStatus {
  ONGOING = "ONGOING",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  UP_COMING = "UP_COMING",
  ON_HOLD = "ON_HOLD",
}

export enum UserStatus {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
  PENDING = "PENDING",
}

export enum Batch_Type {
  ONGOING = "ONGOING",
  UP_COMING = "UP_COMING",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AdmissionRemarkLabel {
  COURSE_TRANSFER = "Course Transfer",
  COURSE_UPGRADATION = "Course Upgradation",
  COURSE_DEGRADE = "Course Degrade",
  COURSE_CANCELLATION = "Course Cancellation",
  FEES = "Fees",
  HOLD = "Hold",
  NSDC = "NSDC",
  DOCUMENT = "Document",
}

export enum AcademicRemarksLabel {
  STUDY = "Study (Pending projects, Exam)",
  PTM = "PTM",
  LOW_PERFORMANCE = "Low Performance",
  WEEKLY_SCHEDULE_NOT_FOLLOW = "Weekly Schedule not Follow",
  DISCIPLINE = "Discipline",
  PUNCTUALITY = "Punctuality",
  IRREGULARITY = "Irregularity",
  COMPANY_VISIT = "Company Visit",
  EXPERT_SESSION = "Expert Session",
  CERTIFICATE = "Certificate",
  PLCAEMENT = "Placement",
  OTHER_CHARGES = "Other Charges",
}

export enum CommonRemarksLabel {
  GENERAL = "General",
}

export enum UserRoleColor {
  Crystal = "#ACDDDE",
  AeroBlue = "#CAF1DE",
  NyaNza = "#E1F8DC",
  CornSilk = "#FEF8DD",
  Bisque = "#FFE7C7",
  SandyTan = "#F7D8BA",
  RosyBrown = "#BC8F8F",
  IndianRed = "#EABCBC",
  DarkRed = "#FF7272",
  BingCherry = "#EA9B9A",
  Bacon = "#E8BDBA",
  MistyRose = "#D0CBCA",
  LightSalmon = "#F8D0C1",
  KidneyBean = "#F5AC8E",
  VerDarkBrown = "#CDB2A5",
  feldsPar = "#EBD1C4",
  Sienna = "#E5B8A2",
  IVoryBlack = "#B7ACA5",
  SemisweetChocolate = "#DBB399",
  peach = "#FFD3B5",
  Titanium = "#DFDCD9",
  PeachPuff = "#D2C9C1",
  SandyBrown = "#FAD8BA",
  Peru = "#EBCEB2",
  Linen = "#FBF2EA",
}

export const DisableUser = {
  CodexGrey: "#9C9C9C",
};

export const availability_time = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

export enum CrmLeadStatus {
  PENDING = "PENDING",
  PUSHED = "PUSHED",
}

export const CRM_FIRST_NAMES = ["Cou.", "BDE", "BM"];

export const CRM_LEAD_ENQUIRIES_VIEW = [
  "name",
  "phone",
  "mobile",
  "mx_reference_by_others",
  "source",
];
export enum CRMStatus {
  Enrolled = "Enrolled",
}

export enum placeAssignType {
  Hardware = "Hardware",
  Laptop = "Laptop",
  Empty = "Empty",
}
export enum RemarksType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export const PlacementStatus = [
  { label: "PENDING", value: "pending" },
  { label: "SHORTLISTED", value: "shortlisted" },
  { label: "INTERVIEW_SCHEDULE", value: "interview_schedule" },
  { label: "OFFERED", value: "offered" },
  { label: "PLACED", value: "placed" },
  { label: "REJECTED", value: "rejected" },
  { label: "CANCELLED", value: "cancelled" },
  { label: "NOT_APPLY", value: "not_apply" },
];

export const EligibilityOptions = Object.freeze([
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "Bachelor's Degree", value: "bachelors_degree" },
  { label: "Master's Degree", value: "masters_degree" },
]);

export const LinkValidation = new RegExp(
  "^" +
    "(?:(?:https?|http)://)" +
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +
    "(?::\\d{2,5})?" +
    "(?:/\\S*)?" +
    "$",
  "i",
);

export enum STATISTICS_DASHBOARD_CHARTS {
  TOTAL_AND_COMPLETION_ADMISSION_REPORT = "Status Wise Admission Report",
  PROJECT_REVENUE_REPORT = "Project Revenue Report",
  ADMISSION_REPORT = "Admission Report (branch wise comparison)",
  PACKAGE_REVENUE_REPORT = "Package Revenue Report",
  SUB_COURSE_REVENUE_REPORT = "Sub Course Revenue Report",
  RECORD_COUNT_BY_SUB_SECTOR = "Record Count by Sub-Sector",
  PAID_AMOUNT_BY_SUB_SECTOR = "Paid Amount by Sub-Sector",
  BUDGET_BY_SUB_SECTOR = "Budget by Sub-Sector",
  OVERDUE_INCOME_BRANCH_WISE = "Overdue Income Branch Wise",
  SUB_SECTOR_NET_PAY = "Sub-Sector Net Pay (Direct vs Indirect)",
  SUB_SECTOR_NET_PAY_DIRECT = "Direct Net Pay by Sub-Sector",
  SUB_SECTOR_NET_PAY_INDIRECT = "Indirect Net Pay by Sub-Sector",
}

export const AdmissionStatus = [
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Hold", value: "HOLD" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Pending", value: "PENDING" },
  { label: "Terminated", value: "TERMINATED" },
];

export enum COURSE_TYPE {
  CAREER_COURSE = "CAREER_COURSE",
  UPSKILL_COURSE = "UPSKILL_COURSE",
}

export const COURSE_TYPE_OPTIONS = [
  { label: "CAREER_COURSE", value: "Career Course" },
  { label: "UPSKILL_COURSE", value: "Upskill Course" },
];

export const DEFAULT_DATE_FORMAT = "DD-MM-YYYY";

export const ROLE_TYPE_SEQUENCE: { [key: string]: number } = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  FACULTY_HEAD: 3,
  FACULTY: 4,
  MANAGER: 5,
  OPERATION_MANAGER: 6,
  SALES_MANAGER: 7,
  ACCOUNT_MANAGER: 8,
};

export enum AbsentFollowUp {
  CALL = "Call",
  EMAIL = "email",
  FROM_FRIEND = "From Friend",
  FROM_OTHER = "From Other",
}

export enum AbsentReasons {
  MEDICAL_LEAVE = "Medical Leave",
  FAMILY_EVENT = "Family Event",
  FAMILY_OUTING = "Family Outing",
  MEDICAL_EMERGENCY = "Medical Emergency",
  TRANSPORTATION_ISSUE = "Transportation Issue",
  WEATHER_CONDITIONS = "Weather Conditions",
  PERSONAL_REASONS = "Personal Reasons",
  OTHER = "Other",
}
export enum NsdcBatchStatus {
  REGISTERED = 0,
  ATTENDANCE = 1,
  ASSESSMENT = 2,
  PLACEMENT = 3,
  PARTIAL_COMPLETE = 4,
  COMPLETED = 5,
}
export enum AbsentRemarksLabel {
  ABSENT_15DAY = "Absent_15day",
  ABSENT_AS_FOLLOW = "Absent as follow",
}

export enum SystemTrackerPerformnce {
  CPU_UTILIZATIONPER = "Cpu UtilizationPer",
  MEMORY_OPTIONS = "Memory Options",
  DISK_ACTIVETIMEPER = "Disk Active TimePer",
}

export enum AnswerType {
  URL = "URL",
  UPLOAD_FILE = "UPLOAD FILE",
}

export const AdmissionSubStatus = [
  { label: "New", value: "NEW" },
  { label: "Waiting", value: "WAITING" },
  { label: "To Be Assigned", value: "TO_BE_ASSIGNED" },
  { label: "Revision", value: "REVISION" },
  { label: "Regular", value: "REGULAR" },
  { label: "Placement", value: "PLACEMENT" },
  { label: "Certificate", value: "CERTIFICATE" },
];

export enum AdmissionSubStatusType {
  NEW = "NEW",
  WAITING = "WAITING",
  TO_BE_ASSIGNED = "TO_BE_ASSIGNED",
  REGULAR = "REGULAR",
  REVISION = "REVISION",
  PLACEMENT = "PLACEMENT",
  CERTIFICATE = "CERTIFICATE",
}

export const subStatusMapping = {
  ONGOING: ["REGULAR", "REVISION"],
  PENDING: ["WAITING", "NEW", "TO_BE_ASSIGNED"],
  COMPLETED: ["PLACEMENT", "CERTIFICATE"],
};

export enum AdmissionStatusKey {
  ONGOING = "ONGOING",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum TargetCategoryType {
  NO_OF_ADMISSIONS = "NO_OF_ADMISSIONS",
  COLLECTIONS = "COLLECTIONS",
}

export enum AllPathNames {
  ViewAdmission = "/view-admission",
}

export const DatePriorTo = "2025-01-04";

export enum RatioColourType {
  RED = "#EA5455",
  YELLOW = "#FFA426",
  GREEN = "#52C766",
}

export enum InfoIconColor {
  RED = "#FF6669",
  BLACK = "#454545",
  GREEN = "#5CB85C",
  PURPLE = "#9852a5",
  YELLOW = "#FFA426",
  LIBERTY = "5864BD",
}

export enum PlacementStatusColor {
  GREEN = "#5CB85C",
}

export const maximumExamRejoinAttempts = 3;

export enum EducationDegree {
  TENTH = "10th",
  TWELFTH = "12th",
  DIPLOMA_IT = "Diploma in IT",
  DIPLOMA_COMPUTER_SCIENCE = "Diploma in Computer Science",
  DIPLOMA_ENGINEERING = "Diploma in Engineering",
  DIPLOMA_BUSINESS_ADMINISTRATION = "Diploma in Business Administration",
  DIPLOMA_ARTS = "Diploma in Arts",
  BA = "BA",
  BSc = "BSc",
  BSC_IT = "BSc IT",
  BCA = "BCA",
  BCom = "BCom",
  BBA = "BBA",
  BTECH = "B.Tech",
  BE = "BE",
  BTECH_IT = "B.Tech IT",
  BE_IT = "BE IT",
  BTECH_CSE = "B.Tech CSE",
  BED = "B.Ed",
  BFA = "BFA",
  LLB = "LLB",
  MA = "MA",
  MSc = "MSc",
  MSc_IT = "MSc IT",
  MCA = "MCA",
  MCom = "MCom",
  MBA = "MBA",
  MTECH = "M.Tech",
  ME = "ME",
  MTECH_IT = "M.Tech IT",
  ME_IT = "ME IT",
  MTECH_CSE = "M.Tech CSE",
  MED = "M.Ed",
  OTHER = "Other",
}

export enum NsdcStudentStatus {
  NON_REGISTERED = 0,
  REGISTERED = 1,
  VERIFIED = 2,
  DROP_OUT = 3,
  DELETED = 4,
}
export enum NsdcRemarks {
  LABEL = "NSDC",
  REMARK_REJECT = "NSDC Rejected",
}
export const NSDCBatchStatus = {
  REGISTERED: 0,
  ATTENDANCE: 1,
  ASSESSMENT: 2,
  PLACEMENT: 3,
  PARTIAL_COMPLETE: 4,
  COMPLETED: 5,
};

export const Pagination = {
  take: 20,
};
export const NsdcStudentsStatus = [
  { label: "Non-Registered", value: 0 },
  { label: "Registered", value: 1 },
  { label: "Verified", value: 2 },
  { label: "Dropout", value: 3 },
  { label: "Deleted", value: 4 },
];

export const NsdcBatchesStatus = [
  { label: "Registered", value: 0 },
  { label: "Attendance", value: 1 },
  { label: "Assessment", value: 2 },
  { label: "Placement", value: 3 },
  { label: "Partial Complete", value: 4 },
  { label: "Complete", value: 5 },
];

export const NsdcColorCode = {
  RedColor: "#ff4747",
  LightRed: "#FF7F7F",
};

export enum PackageBgColor {
  HIGH_PRIORITY = "#d4edda",
  LOW_PRIORITY = "#f8d7da",
}

export enum NsdcStatusName {
  Verified = "Verified",
  Non_Registered = "Non_Registered",
  Registered = "Registered",
  Dropout = "Dropout",
  Deleted = "Deleted",
}

export enum AdmissionFilterKeys {
  BRANCH_ID = "branch_id",
  INSTALLMENT_DATE = "installment_date",
  IS_NRI = "is_nri",
  IS_GST = "is_gst",
  CAREER_COURSE = "career_course",
  UPSKILL_COURSE = "upskill_course",
  SUBCOURSE_STATUS = "subcourse_status",
  YEAR = "year",
  DEPARTMENT_ID = "department_id",
  SUBCOURSE_ID = "subcourse_id",
  COURSE_ID = "course_id",
  PACKAGE_ID = "package_id",
  NSDC_BATCH_ID = "nsdc_batch_id",
  NSDC_STUDENT_STATUS = "nsdc_student_status",
  NSDC_BATCH_STATUS = "nsdc_batch_status",
  STATUS = "status",
  CERTIFICATE_STATUS = "certificate_status",
  MOBILE_NO = "mobile_no",
  FATHER_MOBILE_NO = "father_mobile_no",
  MOTHER_MOBILE_NO = "mother_mobile_no",
  SUB_COURSE = "subcourse",
  PACKAGE = "package",
  REQUEST_STATUS = "request_status",
  PLACEMENT_DONE = "placement_done",
}

export enum InformationType {
  IS_RECEIPT = "IS_RECEIPT",
  IS_BASIC_DETAIL = "IS_BASIC_DETAIL",
  IS_ADMISSION_FEES = "IS_ADMISSION_FEES",
  IS_INSTALLMENT = "IS_INSTALLMENT",
  COURSE_MODIFICATION = "COURSE_MODIFICATION",
  IS_CERTIFICATE = "IS_CERTIFICATE",
}

export enum ProgramType {
  COURSE = "Course",
  PACKAGE = "Package",
}

export const CertificateStatus = {
  PENDING: 1,
  NSDC_PENDING: 2,
  CONFIRMED: 3,
};

export enum CertificateStatusLabel {
  PENDING = "PENDING",
  NSDC_PENDING = "NSDC_PENDING",
  CONFIRMED = "CONFIRMED",
}

export const CertificateGrades = {
  A_PLUS: "A+",
  A: "A",
  B_PLUS: "B+",
  B: "B",
  C: "C",
  D: "D",
};

export enum ConfirmedRemarks {
  REMARK = "Student Confirmed",
}

export const SchoolCollegeType = {
  COLLEGE: "COLLEGE",
  SCHOOL: "SCHOOL",
};


export const RequestStatus = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

export const RequestTypeLabel = [
  { label: "SUBCOURSE_STATUS", value: 1 },
  { label: "INSTALLMENT_MODIFICATION", value: 2 },
  { label: "ADMISSION_STATUS", value: 3 },
];

export const RequestType = {
  SUBCOURSE_STATUS: 1,
  INSTALLMENT_MODIFICATION: 2,
  ADMISSION_STATUS: 3,
};

export enum RequestStatusEnum {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum isConcession {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export enum InvoiceChequeStatus {
  TO_BE_DEPOSIT = "TO_BE_DEPOSIT",
  TO_BE_COLLECTED = "TO_BE_COLLECTED",
  TO_BE_BOUNCE = "TO_BE_BOUNCE",
  TO_BE_CLEARED = "TO_BE_CLEARED",
  TO_BE_CANCELED = "TO_BE_CANCELED",
}

export const ExpenseStatus = {
  OUTSTANDING: 1,
  PAID_COMPLETED: 2,
};

export const ExpenseType = {
  OPERATIONAL_EXPENSE: 1,
  DEVELOPMENT_EXPENSE: 2,
};
