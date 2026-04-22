import type { ICityList } from "src/services/city/city.model";

export interface ICityMasterState {
  citiesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICityList;
  };
  createCity: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
