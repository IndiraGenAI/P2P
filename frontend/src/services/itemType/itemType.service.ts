import { createMasterService } from '../helpers/createMasterService';

export interface IItemTypeRow {
  id: number;
  code: string;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const itemTypeService = createMasterService<IItemTypeRow>('/item-type');
export default itemTypeService;
