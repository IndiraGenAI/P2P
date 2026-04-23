import type { ICostCenterList } from "src/services/cost-center/cost-center.model";

export interface ICostCenterMasterState {
  costCentersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICostCenterList;
  };
  createCostCenter: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
