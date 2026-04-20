import request from "src/lib/axios/request";
import { config } from "src/utils";
import { IApiResponse } from "src/utils/models/common";
import { IRoleRecord } from "src/pages/Role/Role.model";
import { IGetRolePermissions, IRole, IRoleDetails, IRoleStatus } from "./role.model";

class RoleService {
  ENDPOINT = `${config.baseApiMasters}/roles`;

  public searchRoleData = async (data: unknown): Promise<IApiResponse<IRole>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewRole = async (
    data: IRoleDetails,
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editRoleById = async (
    data: IRoleRecord,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeRoleById = async (id: number): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateRoleStatus = async (
    data: IRoleStatus,
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => res.data);
  };

  public getRolePermissions = async (
    id: number,
  ): Promise<IApiResponse<IGetRolePermissions>> => {
    const url = `${this.ENDPOINT}/${id}/permissions`;
    return request({ url, method: "GET" }).then((res) => res.data);
  };
}

export default new RoleService();
