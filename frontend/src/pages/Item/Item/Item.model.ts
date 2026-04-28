export interface IItemRecord {
  id: number;
  code: string;
  name: string;
  item_type_id?: number | null;
  item_category_id?: number | null;
  uom_id?: number | null;
  coa_id?: number | null;
  status?: boolean;
}
