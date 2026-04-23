import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  ICostCenterDetails,
  ICostCenterList,
  ICostCenterStatus,
} from "./cost-center.model";

export interface ICostCenterRecord {
  id: number;
  code: string;
  name: string;
  status?: boolean;
}

class CostCenterService {
  ENDPOINT = config.baseApiMasters + "/cost-center";

  public searchCostCenterData = async (
    data: unknown,
  ): Promise<IApiResponse<ICostCenterList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewCostCenter = async (
    data: ICostCenterDetails,
  ): Promise<IApiResponse<ICostCenterDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editCostCenterById = async (
    data: ICostCenterRecord,
  ): Promise<IApiResponse<ICostCenterDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeCostCenterById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateCostCenterStatus = async (
    data: ICostCenterStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new CostCenterService();
