import { Ref } from "react";
import { IDepartmentRecord } from "../Department.model";

export interface IDepartmentAddProps {
  data?: IDepartmentRecord;
  onSubmit: (value: IDepartmentRecord) => void;
  myRef?: Ref<HTMLElement> | undefined;
}
