import type { Ref } from "react";
import type { ICoaRecord } from "../Coa.model";

export interface ICoaAddOption {
  value: string;
  label: string;
}

export interface ICoaAddProps {
  data?: ICoaRecord;
  onSubmit: (value: ICoaRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  categories: ICoaAddOption[];
}
