import { createMasterService } from '../helpers/createMasterService';

export interface IUomRow {
  id: number;
  code: string;
  name: string;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const uomService = createMasterService<IUomRow>('/uom');
export default uomService;
