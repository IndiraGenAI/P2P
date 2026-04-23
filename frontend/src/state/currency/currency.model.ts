import type { ICurrencyList } from "src/services/currency/currency.model";

export interface ICurrencyMasterState {
  currenciesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICurrencyList;
  };
  createCurrency: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
