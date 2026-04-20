import { IMetaProps } from "src/components/Pagination/Pagination.model";

export interface IBranch {
  rows: IBranchDetails[];
  meta: IMetaProps;
}
export interface IBranchDetails {
  id: number;
  zone_id: number;
  name: string;
  code: string;
  title: string;
  email: string;
  mobile_one: string;
  mobile_two: string;
  landline_no: string;
  website: string;
  pan_no: string;
  gst_no: string;
  status?: boolean;
  zone: IBranchZone;
  bank_name?: string;
  account_holder_name?: string;
  account_no?: string;
  ifsc?: string;
  account_type?: string;
  logo?: string;
  logo_two?: string;
  address?: string;
  country?: string;
  isgst?: boolean;
  is_online?: boolean;
  iscomposition?: boolean;
  state?: string;
  city?: string;
  area?: string;
  created_by?: string;
  created_date?: string;
  updated_by?: string;
  branch_departments: IBranchDepartmentData[];
  updated_date?: string;
  enrolment_no_sequence?: number;
  invoice_no_sequence?: number;
  is_fees_including_gst?: boolean;
  crm_branch?: string;
  help_center_title: IHelpSupportData[];
  biometric_device_number?: string;
  branch_id?: number;
}

export interface IBranchStatus {
  id: number;
  status?: boolean;
}

export interface IHelpSupportData {
  id: number;
  phone_number: string;
  title: string;
}
export interface IBranchZone {
  parent_id: IBranchParentData[];
  name?: string;
  code?: string;
  id: number;
}
export interface IBranchParentData {
  id: number;
  name: string;
  code: string;
}
export interface IBranchDepartmentData {
  branch_id: number;
  department_id?: number;
}

export interface GetBranchType {
  id: number;
  zone_id: number;
  name: string;
  code: string;
  title: string;
  email: string;
  landline_no: string;
  mobile_one: string;
  mobile_two: string;
  website: string;
  pan_no: string;
  cin: string;
  gst_no: string;
  bank_name: string;
  is_online: boolean;
  account_holder_name: string;
  account_no: string;
  ifsc: string;
  account_type: string;
  logo: string;
  logo_two: string;
  address: string;
  country: string;
  state: string;
  city: string;
  area: string;
  status: boolean;
  created_by: string;
  created_date: string;
  updated_date: string;
  enrolment_no_sequence: number;
  invoice_no_sequence: number;
  isgst: boolean;
  iscomposition: boolean;
}

export interface GetTotalIncomeWithPaymentMode {
  ad_in_payment_mode: string;
  noofinvoices: string;
  total_pay_amount: string;
}

export interface GetTotalExpenseWithPaymentMode {
  payment_mode: string;
  total_paying_amount: string;
}
export interface GetRevenueCourseType {
  subcourse_id: number;
  subcourse_name: string;
  branch_id: number;
  branch_name: string;
  isgst: boolean;
  branches_code: string;
  iscomposition: boolean;
  before_discount_amount: string;
  after_discount_amount: string;
  GST: number;
  gst_amount: string;
  noOfAdmission: string;
  package_id: number;
  package_name: string;
  zone_parent_id: number;
  zone_id: number;
}

export interface GetIncomeDataType {
  invoice_branch_id: number;
  admission_installments_payment_mode: string;
  branches_name: string;
  total_pay_amount: string;
  branches_code: string;
  zone_parent_id: number;
  zone_id: number;
}

export interface GetRevenueBranchType {
  admissions_branch_id: number;
  branches_name: string | null;
  branches_id: number;
  branches_isgst: boolean;
  branches_iscomposition: boolean;
  before_discount_amount: string | null;
  after_discount_amount: string | null;
  total_expense: string | null;
  total_outstanding_amount: string | null;
  gst: number;
  gst_amount: string | null;
  noofadmission: string | null;
  branches_code: string;
  zone_id: number;
  zones_parent_id: number;
  zone_parent_id: number;
}

export interface GetBranchWiseAdmissions {
  branch_id: number;
  branch_name: string;
  branch_code: string;
  zone_name: string;
  zone_code: string;
  zone_parent_id: number;
  zone_id: number;
  All: number;
  Cancelled: number;
  Completed: number;
  Hold: number;
  Ongoing: number;
  Pending: number;
  Terminated: number;
  branch_is_online?: boolean;
}


export interface IOnlineBranchData {
  id: number;
  name: string;
  code: string;
  status: boolean;
  zone_id: number;
}
