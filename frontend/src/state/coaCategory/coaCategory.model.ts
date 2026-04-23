import type { ICoaCategoryList } from "src/services/coaCategory/coaCategory.model";

export interface ICoaCategoryMasterState {
  coaCategoriesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICoaCategoryList;
  };
  createCoaCategory: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
