import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  createNewBranch,
  editBranchById,
  examConfig,
  getBranchData,
  removeBranchById,
  searchBranchData,
  todayOverdueOutstandingCount,
  overAllCFOCount,
  updateBranchStatus,
  revenueCourseData,
  incomeModeData,
  getRevenueBranchData,
  getBranchWiseAdmissionData,
  getOnlineBranchData,
} from "./branch.action";
import { IBranchState } from "./branch.model";

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
  account_holder_name: string;
  account_no: string;
  ifsc: string;
  account_type: string;
  logo: string;
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
}

export const initialState: IBranchState = {
  branchesData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      rows: [],
      meta: {
        take: 0,
        itemCount: 0,
        pageCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  },
  createBranches: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  editById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  removeById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  updateById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  getbranchesData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      id: 0,
      zone_id: 0,
      name: "",
      code: "",
      title: "",
      email: "",
      landline_no: "",
      mobile_one: "",
      mobile_two: "",
      website: "",
      pan_no: "",
      cin: "",
      gst_no: "",
      bank_name: "",
      account_holder_name: "",
      account_no: "",
      ifsc: "",
      account_type: "",
      logo: "",
      logo_two: "",
      address: "",
      country: "",
      state: "",
      city: "",
      area: "",
      status: false,
      created_by: "",
      created_date: "",
      updated_date: "",
      enrolment_no_sequence: 0,
      invoice_no_sequence: 0,
      is_online: false,
      isgst: false,
      iscomposition: false,
    },
  },
  updateExamConfig: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  todayOverdueOutstandingCountData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      outstandingCollection: 0,
      outstandingFees: 0,
      overdueCollection: 0,
      overdueFees: 0,
      todayAdmission: 0,
      todayExpense: 0,
      todayRegistration: 0,
    },
  },
  overAllCFOCountData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      totalIncomeWithPaymentMode: [
        { ad_in_payment_mode: "", noofinvoices: "", total_pay_amount: "" },
      ],
      totalExpenseWithPaymentMode: [
        { payment_mode: "", total_paying_amount: "" },
      ],
      revenueCountMonthWise: 0,
    },
  },

  revenueCourse: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
  incomeDataWiseBranch: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
  revenueBranchData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
  getBranchWiseAdmissionData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
  getOnlineBranchData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      id: 0,
      zone_id: 0,
      name: "",
      code: "",
      status: false,
    },
  },
};

export const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = "";
      state.updateById.message = "";
      state.editById.message = "";
      state.updateExamConfig.message = "";
      state.createBranches.message = "";
      state.getBranchWiseAdmissionData.message = "";
    },
  },
  extraReducers: {
    //get branch
    [searchBranchData.pending.type]: (state) => {
      state.branchesData.loading = true;
    },
    [searchBranchData.fulfilled.type]: (state, action) => {
      state.branchesData.data = action.payload.data;
      state.branchesData.message = action.payload.message;
      state.branchesData.loading = false;
      state.branchesData.hasErrors = false;
    },
    [searchBranchData.rejected.type]: (state, action) => {
      state.branchesData.loading = false;
      state.branchesData.hasErrors = true;
      state.branchesData.message = action.error.message;
    },

    //get todayOverdueOutstandingCount

    [todayOverdueOutstandingCount.pending.type]: (state) => {
      state.todayOverdueOutstandingCountData.loading = true;
    },
    [todayOverdueOutstandingCount.fulfilled.type]: (state, action) => {
      state.todayOverdueOutstandingCountData.data = action.payload.data;
      state.todayOverdueOutstandingCountData.message = action.payload.message;
      state.todayOverdueOutstandingCountData.loading = false;
      state.todayOverdueOutstandingCountData.hasErrors = false;
    },
    [todayOverdueOutstandingCount.rejected.type]: (state, action) => {
      state.todayOverdueOutstandingCountData.loading = false;
      state.todayOverdueOutstandingCountData.hasErrors = true;
      state.todayOverdueOutstandingCountData.message = action.error.message;
    },

    //get overAllCFOCountData
    [overAllCFOCount.pending.type]: (state) => {
      state.overAllCFOCountData.loading = true;
    },
    [overAllCFOCount.fulfilled.type]: (state, action) => {
      state.overAllCFOCountData.data = action.payload.data;
      state.overAllCFOCountData.message = action.payload.message;
      state.overAllCFOCountData.loading = false;
      state.overAllCFOCountData.hasErrors = false;
    },
    [overAllCFOCount.rejected.type]: (state, action) => {
      state.overAllCFOCountData.loading = false;
      state.overAllCFOCountData.hasErrors = true;
      state.overAllCFOCountData.message = action.error.message;
    },

    //get revenueCourse Data
    [revenueCourseData.pending.type]: (state) => {
      state.revenueCourse.loading = true;
    },
    [revenueCourseData.fulfilled.type]: (state, action) => {
      state.revenueCourse.data = action.payload.data;
      state.revenueCourse.message = action.payload.message;
      state.revenueCourse.loading = false;
      state.revenueCourse.hasErrors = false;
    },
    [revenueCourseData.rejected.type]: (state, action) => {
      state.revenueCourse.loading = false;
      state.revenueCourse.hasErrors = true;
      state.revenueCourse.message = action.error.message;
    },
    //get incomeDataWiseBranch

    [incomeModeData.pending.type]: (state) => {
      state.incomeDataWiseBranch.loading = true;
    },
    [incomeModeData.fulfilled.type]: (state, action) => {
      state.incomeDataWiseBranch.data = action.payload.data;
      state.incomeDataWiseBranch.message = action.payload.message;
      state.incomeDataWiseBranch.loading = false;
      state.incomeDataWiseBranch.hasErrors = false;
    },
    [incomeModeData.rejected.type]: (state, action) => {
      state.incomeDataWiseBranch.loading = false;
      state.incomeDataWiseBranch.hasErrors = true;
      state.incomeDataWiseBranch.message = action.error.message;
    },

    //get a revenueBranchData
    [getRevenueBranchData.pending.type]: (state) => {
      state.revenueBranchData.loading = true;
    },
    [getRevenueBranchData.fulfilled.type]: (state, action) => {
      state.revenueBranchData.data = action.payload.data;
      state.revenueBranchData.message = action.payload.message;
      state.revenueBranchData.loading = false;
      state.revenueBranchData.hasErrors = false;
    },
    [getRevenueBranchData.rejected.type]: (state, action) => {
      state.revenueBranchData.loading = false;
      state.revenueBranchData.hasErrors = true;
      state.revenueBranchData.message = action.error.message;
    },
    //create branch
    [createNewBranch.pending.type]: (state) => {
      state.createBranches.loading = true;
    },
    [createNewBranch.fulfilled.type]: (state, action) => {
      state.createBranches.message = action.payload.message;
      state.createBranches.hasErrors = action.payload.error;
      state.createBranches.loading = false;
      state.createBranches.hasErrors = false;
    },
    [createNewBranch.rejected.type]: (state, action) => {
      state.createBranches.loading = false;
      state.createBranches.hasErrors = true;
      state.createBranches.message = action.error.message;
    },

    //edit branch
    [editBranchById.pending.type]: (state) => {
      state.editById.loading = true;
    },
    [editBranchById.fulfilled.type]: (state, action) => {
      state.editById.message = action.payload.message;
      state.editById.loading = false;
      state.editById.hasErrors = false;
    },
    [editBranchById.rejected.type]: (state, action) => {
      state.editById.loading = false;
      state.editById.hasErrors = true;
      state.editById.message = action.error.message;
    },

    //update branch
    [updateBranchStatus.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [updateBranchStatus.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [updateBranchStatus.rejected.type]: (state, action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message = action.error.message;
    },

    //Delete branch
    [removeBranchById.pending.type]: (state) => {
      state.removeById.loading = true;
    },
    [removeBranchById.fulfilled.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = false;
      state.removeById.message = action.payload.message;
    },
    [removeBranchById.rejected.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = true;
      state.removeById.message = action.error.message;
    },

    //get by id branch
    [getBranchData.pending.type]: (state) => {
      state.getbranchesData.loading = true;
    },
    [getBranchData.fulfilled.type]: (state, action) => {
      state.getbranchesData.data = action.payload.data;
      state.getbranchesData.message = action.payload.message;
      state.getbranchesData.loading = false;
      state.getbranchesData.hasErrors = false;
    },
    [getBranchData.rejected.type]: (state, action) => {
      state.getbranchesData.loading = false;
      state.getbranchesData.hasErrors = true;
      state.getbranchesData.message = action.error.message;
    },

    //update Exam config
    [examConfig.pending.type]: (state) => {
      state.updateExamConfig.loading = true;
    },
    [examConfig.fulfilled.type]: (state, action) => {
      state.updateExamConfig.message = action.payload.message;
      state.updateExamConfig.loading = false;
      state.updateExamConfig.hasErrors = false;
    },
    [examConfig.rejected.type]: (state, action) => {
      state.updateExamConfig.loading = false;
      state.updateExamConfig.hasErrors = true;
      state.updateExamConfig.message = action.error.message;
    },

    //get a branch wise admissions
    [getBranchWiseAdmissionData.pending.type]: (state) => {
      state.getBranchWiseAdmissionData.loading = true;
    },
    [getBranchWiseAdmissionData.fulfilled.type]: (state, action) => {
      state.getBranchWiseAdmissionData.data = action.payload.data;
      state.getBranchWiseAdmissionData.message = action.payload.message;
      state.getBranchWiseAdmissionData.loading = false;
      state.getBranchWiseAdmissionData.hasErrors = false;
    },
    [getBranchWiseAdmissionData.rejected.type]: (state, action) => {
      state.getBranchWiseAdmissionData.loading = false;
      state.getBranchWiseAdmissionData.hasErrors = true;
      state.getBranchWiseAdmissionData.message = action.error.message;
    },

    [getOnlineBranchData.pending.type]: (state) => {
      state.getOnlineBranchData.loading = true;
    },
    [getOnlineBranchData.fulfilled.type]: (state, action) => {
      state.getOnlineBranchData.data = action.payload.data;
      state.getOnlineBranchData.message = action.payload.message;
      state.getOnlineBranchData.loading = false;
      state.getOnlineBranchData.hasErrors = false;
    },
    [getOnlineBranchData.rejected.type]: (state, action) => {
      state.getOnlineBranchData.loading = false;
      state.getOnlineBranchData.hasErrors = true;
      state.getOnlineBranchData.message = action.error.message;
    },
  },
});

// A selector
export const branchSelector = (state: RootState) => state.branch;

export const { clearRemoveMessage } = branchSlice.actions;

// The reducer
export default branchSlice.reducer;
