import { config } from "src/utils";
import { IUserRecord } from "src/pages/User/Users.model";
import { IApiResponse } from "src/utils/models/common";
import request from "../../lib/axios/request";
import {
  IGetFacultyWiseLectureCount,
  IFacultyUtilizationFilters,
  IUser,
  IUserConfig,
  IUserDetails,
  IUserStatus,
  IGetFacultyWiseLectureCountFilters,
} from "./user.model";

class UserService {
  ENDPOINT = config.baseApiAuth + "/users";

  public searchUserData = async (data: any): Promise<IApiResponse<IUser>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };

  public branchWiseUsers = async (data: any): Promise<IApiResponse<IUser>> => {
    const url = `${this.ENDPOINT}/${data}/branch-wise-users`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };

  public createNewUser = async (
    data: IUserRecord
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => {
      return res.data;
    });
  };

  public editUserById = async (
    data: IUserRecord
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => {
      return res.data;
    });
  };

  public removeUserById = async (id: number) => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => {
      return res.data;
    });
  };

  public updateUserStatus = async (
    data: IUserStatus
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };

  public userProfile = async (
    header?: Record<string, unknown>
  ): Promise<any> => {
    const url = `${this.ENDPOINT}/userprofile`;
    return request({ url, method: "GET", params: header }).then((res) => {
      return res.data;
    });
  };

  public changePassword = async (data: {
    [key: string]: string;
  }): Promise<any> => {
    const url = `${this.ENDPOINT}/notify-password-change`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };

  public resetUserPassword = async (id: number): Promise<any> => {
    const url = `${this.ENDPOINT}/${id}/reset-password`;
    return request({ url, method: "PATCH" }).then((res) => {
      return res.data;
    });
  };
  public getUserDetailsById = async (
    id: number
  ): Promise<IApiResponse<IUserDetails>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "GET", params: id }).then((res) => {
      return res.data;
    });
  };

  public updateUserConfig = async (
    data: IUserConfig
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/updateUserField`;
    return request({ url, method: "PUT", data }).then((res) => {
      return res.data;
    });
  };

  public getFacultyUtilization = async (
    data: IFacultyUtilizationFilters
  ): Promise<IApiResponse<IUserDetails>> => {
    const url = `${this.ENDPOINT}/get-faculty-utilization`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };

  public getFacultyWiseLectureCount = async (
    data: IGetFacultyWiseLectureCountFilters | URLSearchParams | {}
  ): Promise<IApiResponse<IGetFacultyWiseLectureCount>> => {
    const url = `${this.ENDPOINT}/get-faculty-wise-lecture-count`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
}

export default new UserService();
