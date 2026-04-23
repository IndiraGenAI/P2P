export interface ICoaRecord {
  id: number;
  coa_category_id: number;
  gl_code: string;
  gl_name: string;
  distribution_combination: string;
  status?: boolean;
}
