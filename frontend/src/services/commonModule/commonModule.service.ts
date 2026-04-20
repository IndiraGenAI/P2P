import request from "src/lib/axios/request";
import { config } from "src/utils";
import { IApiResponse } from "src/utils/models/common";
import { Configurations } from "src/utils/constants/constant";
import { ConfigDetails, ICommonModuleDetails } from "./commonModule.model";

class CommonModuleService {
  ENDPOINT = `${config.baseApiMasters}/common-modules`;

  public searchCommonModuleData = async (
    data: unknown,
  ): Promise<IApiResponse<ICommonModuleDetails>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => res.data);
  };

  public getConfigurationsDetailsByCode = async (
    data: Configurations[],
  ): Promise<IApiResponse<ConfigDetails[]>> => {
    const url = `${config.baseApiMasters}/configurations/by-code`;
    return request({ url, method: "POST", data }).then((res) => res.data);
  };

  public uploadFileFromFormData = async (
    values: Record<string, unknown>,
    _storagePath: string,
  ): Promise<Record<string, unknown>> => {
    return { ...values };
  };
}

export default new CommonModuleService();
