import type { ICenterList } from "src/services/center/center.model";

export interface ICenterMasterState {
  centersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICenterList;
  };
  createCenter: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
