import request from "src/lib/axios/request";
import { config } from "src/utils";
import { IApiResponse } from "src/utils/models/common";
import { IZoneRecord } from "src/pages/Zone/Zone.model";
import {
  ISearchAllZoneDataPayload,
  IZone,
  IZoneDetails,
  IZoneStatus,
} from "./zone.model";

class ZoneService {
  ENDPOINT = `${config.baseApiMasters}/zones`;

  public removeZoneById = async (id: number): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateZoneStatus = async (
    data: IZoneStatus,
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => res.data);
  };

  public editZoneById = async (
    data: IZoneRecord,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public createNewZone = async (
    data: IZoneDetails,
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public searchZoneData = async (data: unknown): Promise<IApiResponse<IZone>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public searchAllZoneData = async (
    data: ISearchAllZoneDataPayload,
  ): Promise<IApiResponse<IZone>> => {
    const url = `${this.ENDPOINT}/all`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };
}

export default new ZoneService();
