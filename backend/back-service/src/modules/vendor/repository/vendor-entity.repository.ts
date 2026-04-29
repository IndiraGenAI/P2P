import { dataSource } from '@core/data-source';
import { VendorEntity } from 'erp-db';

export const vendorEntityRepository = dataSource
  .getRepository(VendorEntity)
  .extend({});
