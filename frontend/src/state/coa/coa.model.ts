import type { ICoaList } from "src/services/coa/coa.model";

export interface ICoaMasterState {
  coasData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICoaList;
  };
  createCoa: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
