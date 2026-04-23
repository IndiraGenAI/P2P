export interface ICurrencyRecord {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
  status?: boolean;
}
