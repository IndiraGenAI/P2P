import type { ICountry } from "src/services/country/country.model";

export interface ICountryState {
  countriesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ICountry;
  };
  createCountry: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
}
