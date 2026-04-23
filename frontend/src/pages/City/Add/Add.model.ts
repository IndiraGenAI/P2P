import type { Ref } from "react";
import type { ICityRecord } from "../City.model";

export interface ICityAddOption {
  value: string;
  label: string;
}

export interface ICityAddProps {
  data?: ICityRecord;
  onSubmit: (value: ICityRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  countries: ICityAddOption[];
}
