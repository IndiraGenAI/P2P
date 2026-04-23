import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICoaCategoryDetails,
  ICoaCategoryList,
  ICoaCategoryStatus,
} from "./coaCategory.model";

export interface ICoaCategoryRecord {
  id: number;
  name: string;
  status?: boolean;
}

class CoaCategoryService {
  ENDPOINT = config.baseApiMasters + "/coa-category";

  public searchCoaCategoryData = async (
    data: unknown,
  ): Promise<IApiResponse<ICoaCategoryList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCoaCategory = async (
    data: ICoaCategoryDetails,
  ): Promise<IApiResponse<ICoaCategoryDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCoaCategoryById = async (
    data: ICoaCategoryRecord,
  ): Promise<IApiResponse<ICoaCategoryDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCoaCategoryById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCoaCategoryStatus = async (
    data: ICoaCategoryStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CoaCategoryService();
