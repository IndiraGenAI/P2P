import { dataSource } from '@core/data-source';
import { VendorEntity } from 'erp-db';

export const VendorEntityRepository = dataSource
  .getRepository(VendorEntity)
  .extend({});
