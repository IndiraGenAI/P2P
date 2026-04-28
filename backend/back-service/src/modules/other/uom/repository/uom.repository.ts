import { dataSource } from '@core/data-source';
import { Uom } from 'erp-db';

export const UomRepository = dataSource.getRepository(Uom).extend({});
