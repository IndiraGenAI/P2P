import type { Ref } from "react";
import type { ICountryRecord } from "../Country.model";

export interface ICountryAddProps {
  data?: ICountryRecord;
  onSubmit: (value: ICountryRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
