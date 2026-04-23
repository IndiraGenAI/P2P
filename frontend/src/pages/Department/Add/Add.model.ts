import type { Ref } from "react";
import type { IDepartmentRecord } from "../Department.model";

export interface IDepartmentAddProps {
  data?: IDepartmentRecord;
  onSubmit: (value: IDepartmentRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
