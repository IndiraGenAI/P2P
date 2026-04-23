import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ITdsDetails,
  ITdsList,
  ITdsStatus,
} from "./tds.model";

export interface ITdsRecord {
  id: number;
  code: string;
  name: string;
  percentage: number | string;
  status?: boolean;
}

class TdsService {
  ENDPOINT = config.baseApiMasters + "/tds";

  public searchTdsData = async (
    data: unknown,
  ): Promise<IApiResponse<ITdsList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewTds = async (
    data: ITdsDetails,
  ): Promise<IApiResponse<ITdsDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editTdsById = async (
    data: ITdsRecord,
  ): Promise<IApiResponse<ITdsDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeTdsById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateTdsStatus = async (
    data: ITdsStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new TdsService();
