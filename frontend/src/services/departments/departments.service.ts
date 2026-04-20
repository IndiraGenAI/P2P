import request from "../../lib/axios/request";
import { IApiResponse } from "../../utils/models/common";
import { IDepartmentRecord } from "../../pages/Department/Department.model";
import {
  IDepartmentStatus,
  IDepartmentDetails,
  Idepartment,
} from "./departments.model";
import { config } from "src/utils";

class DepartmentService {
  ENDPOINT = config.baseApiMasters+ "/departments";

  public removeDepartmentById = async (
    id: number
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => {
      return res.data;
    });
  };

  public updateDepartmentStatus = async (
    data: IDepartmentStatus
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };

  public editDepartmentById = async (
    data: IDepartmentRecord
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => {
      return res.data;
    });
  };

  public createNewDepartment = async (
    data: IDepartmentDetails
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => {
      return res.data;
    });
  };

  public searchDepartmentData = async (
    data: IDepartmentDetails
  ): Promise<IApiResponse<Idepartment[]>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
}

export default new DepartmentService();
