import { dataSource } from '@core/data-source';
import { VendorBankDetail } from 'erp-db';

export const VendorBankDetailRepository = dataSource
  .getRepository(VendorBankDetail)
  .extend({});
