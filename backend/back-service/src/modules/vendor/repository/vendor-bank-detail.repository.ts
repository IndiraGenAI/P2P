import { dataSource } from '@core/data-source';
import { VendorBankDetail } from 'erp-db';

export const vendorBankDetailRepository = dataSource
  .getRepository(VendorBankDetail)
  .extend({});
