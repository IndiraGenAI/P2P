import { dataSource } from '@core/data-source';
import { VendorCategory } from 'erp-db';

export const VendorCategoryRepository = dataSource
  .getRepository(VendorCategory)
  .extend({});
