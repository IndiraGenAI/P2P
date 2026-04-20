export interface IRoleRecord {
  id: number;
  name?: string;
  description?: string;
  status?: boolean;
  [key: string]: unknown;
}
