import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IDepartmentDetails,
  IDepartmentList,
  IDepartmentStatus,
} from "./department.model";

export interface IDepartmentRecord {
  id: number;
  name: string;
  code: string;
  status?: boolean;
}

class DepartmentService {
  ENDPOINT = config.baseApiMasters + "/department";

  public searchDepartmentData = async (
    data: unknown,
  ): Promise<IApiResponse<IDepartmentList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewDepartment = async (
    data: IDepartmentDetails,
  ): Promise<IApiResponse<IDepartmentDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editDepartmentById = async (
    data: IDepartmentRecord,
  ): Promise<IApiResponse<IDepartmentDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeDepartmentById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateDepartmentStatus = async (
    data: IDepartmentStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new DepartmentService();
