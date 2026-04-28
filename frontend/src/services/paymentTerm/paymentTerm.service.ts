import { createMasterService } from '../helpers/createMasterService';

export interface IPaymentTermRow {
  id: number;
  code: string;
  name: string;
  oracle_code?: string | null;
  status?: boolean;
  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

const paymentTermService = createMasterService<IPaymentTermRow>(
  '/payment-term',
);
export default paymentTermService;
