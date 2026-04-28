import { createMasterService } from '../helpers/createMasterService';

export interface IItemRow {
  id: number;
  code: string;
  name: string;
  item_type_id?: number | null;
  item_category_id?: number | null;
  uom_id?: number | null;
  coa_id?: number | null;
  status?: boolean;
  item_type?: { id: number; code: string; name: string } | null;
  item_category?: { id: number; code: string; name: string } | null;
  uom?: { id: number; code: string; name: string } | null;
  coa?: { id: number; code: string; name: string } | null;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const itemService = createMasterService<IItemRow>('/item');
export default itemService;
