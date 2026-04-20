import { Rule } from "antd/lib/form";

export interface ILocationProps{
  name?:string;
  placeholder?:string;
  rules?:Rule[]
}
export interface LocationData {
  id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  name: string;
  pincode: string;
  status: boolean;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
}

  export interface LocationData {
    id: number
    country_id: number
    state_id: number
    city_id: number
    name: string
    pincode: string
    status: boolean
    created_by: string
    created_date: string
    updated_by: string
    updated_date: string
  }

  export interface CountryStatus{
    status: boolean;
  }

  export interface StateStatus{
    status: boolean;
  }
  export interface CityStatus {
    status: boolean;
  }

  export interface AreaStatus{
    status: boolean;
  }

  