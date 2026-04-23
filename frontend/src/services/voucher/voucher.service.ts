import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IVoucherDetails,
  IVoucherList,
  IVoucherStatus,
} from "./voucher.model";

export interface IVoucherRecord {
  id: number;
  code: string;
  name: string;
  status?: boolean;
}

class VoucherService {
  ENDPOINT = config.baseApiMasters + "/voucher";

  public searchVoucherData = async (
    data: unknown,
  ): Promise<IApiResponse<IVoucherList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewVoucher = async (
    data: IVoucherDetails,
  ): Promise<IApiResponse<IVoucherDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editVoucherById = async (
    data: IVoucherRecord,
  ): Promise<IApiResponse<IVoucherDetails>> => {
    const { id, ...rest } = data;
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "PUT", data: rest }).then((res) => res.data);
  };

  public removeVoucherById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateVoucherStatus = async (
    data: IVoucherStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new VoucherService();
