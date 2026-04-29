import { dataSource } from '@core/data-source';
import { Uom } from 'erp-db';

export const uomRepository = dataSource.getRepository(Uom).extend({});
