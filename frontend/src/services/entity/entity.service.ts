import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IEntityDetails,
  IEntityList,
  IEntityStatus,
} from "./entity.model";

export interface IEntityRecord {
  id: number;
  code: string;
  name: string;
  business_unit?: string | null;
  legal_entity?: string | null;
  liability_distribution?: string | null;
  prepayment_distribution?: string | null;
  shipping_addresses?: string[] | null;
  billing_addresses?: string[] | null;
  status?: boolean;
}

class EntityService {
  ENDPOINT = config.baseApiMasters + "/entity";

  public searchEntityData = async (
    data: unknown,
  ): Promise<IApiResponse<IEntityList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewEntity = async (
    data: IEntityDetails,
  ): Promise<IApiResponse<IEntityDetails>> => {
    const url = `${this.ENDPOINT}`;
    const { id: _omit, ...rest } = data;
    void _omit;
    return request({ url, method: "POST", data: rest }).then((res) => res.data);
  };

  public editEntityById = async (
    data: IEntityRecord,
  ): Promise<IApiResponse<IEntityDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeEntityById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateEntityStatus = async (
    data: IEntityStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new EntityService();
