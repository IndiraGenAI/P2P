import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICenterDetails,
  ICenterList,
  ICenterStatus,
} from "./center.model";

export interface ICenterRecord {
  id: number;
  code: string;
  name: string;
  status?: boolean;
}

class CenterService {
  ENDPOINT = config.baseApiMasters + "/center";

  public searchCenterData = async (
    data: unknown,
  ): Promise<IApiResponse<ICenterList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCenter = async (
    data: ICenterDetails,
  ): Promise<IApiResponse<ICenterDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCenterById = async (
    data: ICenterRecord,
  ): Promise<IApiResponse<ICenterDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCenterById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCenterStatus = async (
    data: ICenterStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CenterService();
