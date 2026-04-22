import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IUser,
  IUserCreatePayload,
  IUserDetails,
  IUserStatus,
  IUserUpdatePayload,
} from "./user.model";

class UserService {
  ENDPOINT = config.baseApiAuth + "/users";

  public searchUserData = async (
    data: unknown,
  ): Promise<IApiResponse<IUser>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewUser = async (
    data: IUserCreatePayload,
  ): Promise<IApiResponse<IUserDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editUserById = async (
    data: IUserUpdatePayload,
  ): Promise<IApiResponse<IUserDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeUserById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateUserStatus = async (
    data: IUserStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new UserService();
