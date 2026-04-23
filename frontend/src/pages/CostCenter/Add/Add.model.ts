import type { Ref } from "react";
import type { ICostCenterRecord } from "../CostCenter.model";

export interface ICostCenterAddProps {
  data?: ICostCenterRecord;
  onSubmit: (value: ICostCenterRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
