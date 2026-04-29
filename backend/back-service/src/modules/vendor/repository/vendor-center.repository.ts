import { dataSource } from '@core/data-source';
import { VendorCenter } from 'erp-db';

export const vendorCenterRepository = dataSource
  .getRepository(VendorCenter)
  .extend({});
