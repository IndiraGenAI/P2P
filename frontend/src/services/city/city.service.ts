import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICityDetails,
  ICityList,
  ICityStatus,
} from "./city.model";

export interface ICityRecord {
  id: number;
  name: string;
  country_id: number;
  state_id: number;
  status?: boolean;
}

class CityService {
  ENDPOINT = config.baseApiMasters + "/city";

  public searchCityData = async (
    data: unknown,
  ): Promise<IApiResponse<ICityList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCity = async (
    data: ICityDetails,
  ): Promise<IApiResponse<ICityDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCityById = async (
    data: ICityRecord,
  ): Promise<IApiResponse<ICityDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeCityById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCityStatus = async (
    data: ICityStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CityService();
