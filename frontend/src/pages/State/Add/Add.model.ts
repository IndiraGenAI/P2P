import type { Ref } from "react";
import type { IStateRecord } from "../State.model";

export interface IStateAddOption {
  value: string;
  label: string;
}

export interface IStateAddProps {
  data?: IStateRecord;
  onSubmit: (value: IStateRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  countries: IStateAddOption[];
}
