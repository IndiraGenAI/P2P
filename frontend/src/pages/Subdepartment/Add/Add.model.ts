import type { Ref } from "react";
import type { ISubdepartmentRecord } from "../Subdepartment.model";

export interface ISubdepartmentAddOption {
  value: string;
  label: string;
}

export interface ISubdepartmentAddProps {
  data?: ISubdepartmentRecord;
  onSubmit: (value: ISubdepartmentRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  departments: ISubdepartmentAddOption[];
}
