import config from "@/utils/config";
import request from "@/axios/request";
import type { IApiResponse } from "@/utils/models/common";
import type {
  IInvoiceSourceDetails,
  IInvoiceSourceList,
  IInvoiceSourceStatus,
} from "./invoiceSource.model";

export interface IInvoiceSourceRecord {
  id: number;
  code: string;
  name: string;
  status?: boolean;
}

class InvoiceSourceService {
  ENDPOINT = config.baseApiMasters + "/invoice-source";

  public searchInvoiceSourceData = async (
    data: unknown,
  ): Promise<IApiResponse<IInvoiceSourceList>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public createNewInvoiceSource = async (
    data: IInvoiceSourceDetails,
  ): Promise<IApiResponse<IInvoiceSourceDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public editInvoiceSourceById = async (
    data: IInvoiceSourceRecord,
  ): Promise<IApiResponse<IInvoiceSourceDetails>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => res.data);
  };

  public removeInvoiceSourceById = async (
    id: number,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => res.data);
  };

  public updateInvoiceSourceStatus = async (
    data: IInvoiceSourceStatus,
  ): Promise<IApiResponse<unknown>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({
      url,
      method: "PATCH",
      data: { status: data.status },
    }).then((res) => res.data);
  };
}

export default new InvoiceSourceService();
