import type { Ref } from "react";
import type { IVoucherRecord } from "../Voucher.model";

export interface IVoucherAddProps {
  data?: IVoucherRecord;
  onSubmit: (value: IVoucherRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
