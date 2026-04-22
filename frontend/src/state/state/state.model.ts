import type { IStateList } from "src/services/state/state.model";

export interface IStateMasterState {
  statesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IStateList;
  };
  createState: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
