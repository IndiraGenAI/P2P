import type { ITdsList } from "src/services/tds/tds.model";

export interface ITdsMasterState {
  tdsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ITdsList;
  };
  createTds: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
