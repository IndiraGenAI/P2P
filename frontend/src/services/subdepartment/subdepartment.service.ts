import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ISubdepartmentDetails,
  ISubdepartmentList,
  ISubdepartmentStatus,
} from "./subdepartment.model";

export interface ISubdepartmentRecord {
  id: number;
  name: string;
  code: string;
  department_id: number;
  status?: boolean;
}

class SubdepartmentService {
  ENDPOINT = config.baseApiMasters + "/subdepartment";

  public searchSubdepartmentData = async (
    data: unknown,
  ): Promise<IApiResponse<ISubdepartmentList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewSubdepartment = async (
    data: ISubdepartmentDetails,
  ): Promise<IApiResponse<ISubdepartmentDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editSubdepartmentById = async (
    data: ISubdepartmentRecord,
  ): Promise<IApiResponse<ISubdepartmentDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeSubdepartmentById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateSubdepartmentStatus = async (
    data: ISubdepartmentStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new SubdepartmentService();
