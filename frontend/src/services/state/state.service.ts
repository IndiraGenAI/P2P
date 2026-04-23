import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IStateDetails,
  IStateList,
  IStateStatus,
} from "./state.model";

export interface IStateRecord {
  id: number;
  name: string;
  country_id: number;
  status?: boolean;
}

class StateService {
  ENDPOINT = config.baseApiMasters + "/state";

  public searchStateData = async (
    data: unknown,
  ): Promise<IApiResponse<IStateList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewState = async (
    data: IStateDetails,
  ): Promise<IApiResponse<IStateDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editStateById = async (
    data: IStateRecord,
  ): Promise<IApiResponse<IStateDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeStateById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateStateStatus = async (
    data: IStateStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new StateService();
