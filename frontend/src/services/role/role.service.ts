import config from "@/utils/config";
import type {
  IGetRolePermissions,
  IRole,
  IRoleDetails,
  IRoleStatus,
} from "./role.model";
import type { IRoleRecord } from "@/pages/Role/Role.model";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";

class RoleService {
  ENDPOINT = config.baseApiAuth + "/roles";

  public searchRoleData = async (
    data: unknown,
  ): Promise<IApiResponse<IRole>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewRole = async (
    data: IRoleDetails,
  ): Promise<IApiResponse<IRoleDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editRoleById = async (
    data: IRoleRecord,
  ): Promise<IApiResponse<IRoleDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeRoleById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateRoleStatus = async (
    data: IRoleStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };

  public getRolePermissions = async (
    id: number,
  ): Promise<IApiResponse<IGetRolePermissions>> => {
    const url = `${this.ENDPOINT}/permissions/${id}`;
    return request({ url, method: "GET" }).then((res) => res.data);
  };
}

export default new RoleService();
