import { createMasterService } from '../helpers/createMasterService';

export interface ITermsConditionRow {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const termsConditionService = createMasterService<ITermsConditionRow>(
  '/terms-condition',
);
export default termsConditionService;
