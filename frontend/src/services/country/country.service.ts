import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICountry,
  ICountryDetails,
  ICountryStatus,
} from "./country.model";

export interface ICountryRecord {
  id: number;
  name: string;
  status?: boolean;
}

class CountryService {
  ENDPOINT = config.baseApiMasters + "/country";

  public searchCountryData = async (
    data: unknown,
  ): Promise<IApiResponse<ICountry>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCountry = async (
    data: ICountryDetails,
  ): Promise<IApiResponse<ICountryDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCountryById = async (
    data: ICountryRecord,
  ): Promise<IApiResponse<ICountryDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCountryById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCountryStatus = async (
    data: ICountryStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CountryService();
