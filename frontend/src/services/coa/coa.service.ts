import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type { ICoaDetails, ICoaList, ICoaStatus } from "./coa.model";

export interface ICoaRecord {
  id: number;
  coa_category_id: number;
  gl_code: string;
  gl_name: string;
  distribution_combination: string;
  status?: boolean;
}

class CoaService {
  ENDPOINT = config.baseApiMasters + "/coa";

  public searchCoaData = async (
    data: unknown,
  ): Promise<IApiResponse<ICoaList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCoa = async (
    data: ICoaDetails,
  ): Promise<IApiResponse<ICoaDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCoaById = async (
    data: ICoaRecord,
  ): Promise<IApiResponse<ICoaDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCoaById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCoaStatus = async (
    data: ICoaStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CoaService();
