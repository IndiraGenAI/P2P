import type { Moment } from "moment";

export type DateData = {
  [key: string]: unknown;
  date_from?: string;
  date_end?: string;
  cheque_date?: Moment;
  transaction_date?: Moment;
  start_date?: Moment;
  end_date?: Moment;
  admission_date?: Moment;
};
