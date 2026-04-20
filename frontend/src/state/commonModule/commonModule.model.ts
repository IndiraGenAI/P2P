import {
  ConfigDetails,
  ICommonModuleDetails,
} from "src/services/commonModule/commonModule.model";

export interface ICommonModuleState {
  commonModulesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICommonModuleDetails;
  };

  configurationsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ConfigDetails[];
  };
}
