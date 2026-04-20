import {
  GetBranchType,
  GetBranchWiseAdmissions,
  GetIncomeDataType,
  GetRevenueBranchType,
  GetRevenueCourseType,
  GetTotalExpenseWithPaymentMode,
  GetTotalIncomeWithPaymentMode,
  IBranch,
  IOnlineBranchData,
} from "src/services/branch/branch.model";

export interface IBranchState {
  branchesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IBranch;
  };

  createBranches: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  getbranchesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: GetBranchType;
  };
  updateExamConfig: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  todayOverdueOutstandingCountData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: {
      outstandingCollection: number;
      outstandingFees: number;
      overdueCollection: number;
      overdueFees: number;
      todayAdmission: number;
      todayExpense: number;
      todayRegistration: number;
    };
  };
  overAllCFOCountData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: {
      totalIncomeWithPaymentMode: GetTotalIncomeWithPaymentMode[];
      totalExpenseWithPaymentMode: GetTotalExpenseWithPaymentMode[];
      revenueCountMonthWise: 0;
    };
  };

  revenueCourse: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: GetRevenueCourseType[];
  };

  incomeDataWiseBranch: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: GetIncomeDataType[];
  };

  revenueBranchData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: GetRevenueBranchType[];
  };

  getBranchWiseAdmissionData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: GetBranchWiseAdmissions[];
  };

  getOnlineBranchData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IOnlineBranchData;
  };
}
