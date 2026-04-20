import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBranchRecord, IExamConfig } from "src/pages/Branch/Branch.model";
import { IBranchStatus } from "src/services/branch/branch.model";
import branchService from "src/services/branch/branch.service";
import { IDateFilter, IOnlineBranchFilter } from "src/utils/models/common";

export const searchBranchData = createAsyncThunk(
  "branch/searchBranchData",
  async (data: any) => {
    return branchService.searchBranchData(data);
  }
);

export const getRevenueBranchData = createAsyncThunk(
  "branch/getRevenueBranchData",
  async (data: IDateFilter) => {
    return branchService.getRevenueBranchData(data);
  }
);
export const incomeModeData = createAsyncThunk(
  "branch/incomeModeData",
  async (data: IDateFilter) => {
    return branchService.incomeModeData(data);
  }
);
export const overAllCFOCount = createAsyncThunk(
  "branch/overAllCFOCount",
  async (data: URLSearchParams | {}) => {
    return branchService.overAllCFOCount(data);
  }
);

export const todayOverdueOutstandingCount= createAsyncThunk(
  "branch/todayOverdueOutstandingCount",
  async (data: URLSearchParams | {}) => {
    return branchService.todayOverdueOutstandingCount(data);
  }
);
export const revenueCourseData= createAsyncThunk(
  "branch/revenueCourseData",
  async (data: any) => {
    return branchService.revenueCourseData(data);
  }
);


export const createNewBranch = createAsyncThunk(
  "branch/createNewBranch",
  async (data: IBranchRecord) => {
    return branchService.createNewBranch(data);
  }
);
export const editBranchById = createAsyncThunk(
  "branch/editBranchById",
  async (data: IBranchRecord) => {
    return branchService.editBranchById(data);
  }
);
export const removeBranchById = createAsyncThunk(
  "branch/removeBranchById",
  async (id: number) => {
    return branchService.removeBranchById(id);
  }
);

export const updateBranchStatus = createAsyncThunk(
  "branch/updateBranchStatus",
  async (data: IBranchStatus) => {
    return branchService.updateBranchStatus(data);
  }
);

export const getBranchData = createAsyncThunk(
  "branch/getBtanchById",
  async (id: number) => {
    return branchService.getBranchData(id);
  }
)
export const examConfig = createAsyncThunk(
  "branch/examConfig",
  async (data: IExamConfig) => {
    return branchService.examConfig(data);
  }
);

export const getBranchWiseAdmissionData = createAsyncThunk(
  "branch/getBranchWiseAdmissionData",
  async (data: IDateFilter) => {
    return branchService.getBranchWiseAdmissionData(data);
  }
);

export const getOnlineBranchData = createAsyncThunk(
  "branch/getOnlineBranchData",
  async (data: IOnlineBranchFilter) => {
    return branchService.getOnlineBranchData(data);
  }
);
