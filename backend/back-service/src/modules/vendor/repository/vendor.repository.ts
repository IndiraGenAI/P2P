import { dataSource } from '@core/data-source';
import { Vendor } from 'erp-db';

export const vendorRepository = dataSource.getRepository(Vendor).extend({});
