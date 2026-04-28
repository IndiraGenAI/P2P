import { dataSource } from '@core/data-source';
import { VendorCenter } from 'erp-db';

export const VendorCenterRepository = dataSource
  .getRepository(VendorCenter)
  .extend({});
