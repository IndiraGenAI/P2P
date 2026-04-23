import type { Ref } from "react";
import type { ICurrencyRecord } from "../Currency.model";

export interface ICurrencyAddProps {
  data?: ICurrencyRecord;
  onSubmit: (value: ICurrencyRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
