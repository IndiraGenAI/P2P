import type { Ref } from "react";
import type { ITdsRecord } from "../Tds.model";

export interface ITdsAddProps {
  data?: ITdsRecord;
  onSubmit: (value: ITdsRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
