import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IZoneDetails,
  IZoneList,
  IZoneStatus,
} from "./zone.model";

export interface IZoneRecord {
  id: number;
  name: string;
  country_id: number;
  code?: string | null;
  status?: boolean;
}

class ZoneService {
  ENDPOINT = config.baseApiMasters + "/zone";

  public searchZoneData = async (
    data: unknown,
  ): Promise<IApiResponse<IZoneList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewZone = async (
    data: IZoneDetails,
  ): Promise<IApiResponse<IZoneDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editZoneById = async (
    data: IZoneRecord,
  ): Promise<IApiResponse<IZoneDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeZoneById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateZoneStatus = async (
    data: IZoneStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new ZoneService();
