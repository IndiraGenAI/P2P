import { dataSource } from '@core/data-source';
import { VendorSite } from 'erp-db';

export const VendorSiteRepository = dataSource
  .getRepository(VendorSite)
  .extend({});
