import { dataSource } from '@core/data-source';
import { VendorCategory } from 'erp-db';

export const vendorCategoryRepository = dataSource
  .getRepository(VendorCategory)
  .extend({});
