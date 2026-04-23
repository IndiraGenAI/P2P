import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICurrencyDetails,
  ICurrencyList,
  ICurrencyStatus,
} from "./currency.model";

export interface ICurrencyRecord {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
  status?: boolean;
}

class CurrencyService {
  ENDPOINT = config.baseApiMasters + "/currency";

  public searchCurrencyData = async (
    data: unknown,
  ): Promise<IApiResponse<ICurrencyList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCurrency = async (
    data: ICurrencyDetails,
  ): Promise<IApiResponse<ICurrencyDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCurrencyById = async (
    data: ICurrencyRecord,
  ): Promise<IApiResponse<ICurrencyDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCurrencyById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCurrencyStatus = async (
    data: ICurrencyStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CurrencyService();
