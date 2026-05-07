import { dataSource } from '@core/data-source';
import { Grn } from 'erp-db';

export const grnRepository = dataSource.getRepository(Grn).extend({});
