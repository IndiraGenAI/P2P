import { Ref } from "react";
import { IUserRecord } from "../Users.model";


export interface IUserAddProps {
  data?: IUserRecord;
  onSubmit: (value: IUserRecord) => void;
  myRef?: Ref<HTMLElement> | undefined;
  otherUserRoles?: IRoleList[];
}

 export interface optionType{
  value:string;
  key:number
}

export interface IRoleList {
  id?: number;
  status?: boolean;
  role_id?: number;
  zone_id?: number;
  user_role_color?: string;
}