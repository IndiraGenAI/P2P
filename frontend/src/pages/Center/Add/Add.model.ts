import type { Ref } from "react";
import type { ICenterRecord } from "../Center.model";

export interface ICenterAddProps {
  data?: ICenterRecord;
  onSubmit: (value: ICenterRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
