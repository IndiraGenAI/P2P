import { dataSource } from '@core/data-source';
import { VendorSite } from 'erp-db';

export const vendorSiteRepository = dataSource
  .getRepository(VendorSite)
  .extend({});
