import { dataSource } from '@core/data-source';
import { Vendor } from 'erp-db';

export const VendorRepository = dataSource.getRepository(Vendor).extend({});
