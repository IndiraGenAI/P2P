import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IGstDetails,
  IGstList,
  IGstStatus,
} from "./gst.model";

export interface IGstRecord {
  id: number;
  code: string;
  name: string;
  percentage: number | string;
  status?: boolean;
}

class GstService {
  ENDPOINT = config.baseApiMasters + "/gst";

  public searchGstData = async (
    data: unknown,
  ): Promise<IApiResponse<IGstList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewGst = async (
    data: IGstDetails,
  ): Promise<IApiResponse<IGstDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editGstById = async (
    data: IGstRecord,
  ): Promise<IApiResponse<IGstDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeGstById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateGstStatus = async (
    data: IGstStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new GstService();
