import request from "src/lib/axios/request";
import { IBranchRecord, IExamConfig } from "src/pages/Branch/Branch.model";
import { config } from "src/utils";
import { IApiResponse, IDateFilter, IOnlineBranchFilter } from "src/utils/models/common";
import { IBranch, IBranchStatus, IOnlineBranchData } from "./branch.model";
import moment from "moment";

class BranchService {
  ENDPOINT = config.baseApiMasters + "/branches";

  public searchBranchData = async (
    data: any
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
  public getRevenueBranchData = async (
    data: IDateFilter
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/revenueBranch`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
  public incomeModeData = async (
    data: IDateFilter
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/incomeBranch`;
    const params = {
      ...data,
      start_date: data.start_date
        ? moment(data.start_date).format("YYYY-MM-DD")
        : undefined,
      end_date: data.end_date
        ? moment(data.end_date).format("YYYY-MM-DD")
        : undefined,
    };

    return request({
      url,
      method: "GET",
      params,
    }).then((res) => res.data);
  };
  public overAllCFOCount = async (
    data: URLSearchParams | {}
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/overAllCFOCount`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
  public todayOverdueOutstandingCount = async (
    data: URLSearchParams | {}
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/todayOverdueOutstandingCount`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
  public revenueCourseData = async (
    data: IDateFilter
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/revenueCourseData`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };

  public createNewBranch = async (
    data: IBranchRecord
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/create-branch`;
    return request({ url, method: "POST", data }).then((res) => {
      return res.data;
    });
  };

  public editBranchById = async (
    data: IBranchRecord
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => {
      return res.data;
    });
  };

  public removeBranchById = async (id: number) => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => {
      return res.data;
    });
  };

  public updateBranchStatus = async (
    data: IBranchStatus
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };

  public getBranchData = async (id: number): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "GET", params: id }).then((res) => {
      return res.data;
    });
  };

  public examConfig = async (
    data: IExamConfig
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/exam-portal-config`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };
  public getBranchWiseAdmissionData = async (
    data: IDateFilter
  ): Promise<IApiResponse<IBranch>> => {
    const url = `${this.ENDPOINT}/branch-wise-admission`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };

  public getOnlineBranchData = async (
    data: IOnlineBranchFilter
  ): Promise<IApiResponse<IOnlineBranchData>> => {
    const url = `${this.ENDPOINT}/get-online-branch`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
}

export default new BranchService();
