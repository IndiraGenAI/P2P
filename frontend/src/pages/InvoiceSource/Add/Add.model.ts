import type { Ref } from "react";
import type { IInvoiceSourceRecord } from "../InvoiceSource.model";

export interface IInvoiceSourceAddProps {
  data?: IInvoiceSourceRecord;
  onSubmit: (value: IInvoiceSourceRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
