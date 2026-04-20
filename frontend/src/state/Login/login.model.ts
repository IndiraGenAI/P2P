import { IAuthConfigs, IUserDataAll } from "src/services/login/login.model";

export interface ILoginState {
  userData: {
    data: IUserDataAll;
    configData: IAuthConfigs;
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  logout: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  forcePasswordChange: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  forgotPasswordChange: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  forgotPassword: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  userRoleId: number;
  isBranchSelected: boolean;
  studentPortal: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  changePassword: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
}
