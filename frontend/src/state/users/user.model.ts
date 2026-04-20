import { IUserDataAll } from "src/services/login/login.model";
import { FacultyUtilization, FacultyWiseLecture, IUser, IUserDetails } from "src/services/user/user.model";

export interface IUserState {
  usersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IUser;
  };
  createUsers: {
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
  userData: {
    data: IUserDetails;
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  changePassword: {
    data: IUserDataAll;
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  branchwiseusersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IUser;
  };
  getUserDetailsById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IUserDetails;
  };
  updateUserConfig: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  getFacultyUtilization: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: FacultyUtilization[];
  };
  getFacultyWiseLectureCount: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: FacultyWiseLecture[];
  };
}
