import { dataSource } from '@core/data-source';
import { Tds } from 'erp-db';

export const tdsRepository = dataSource.getRepository(Tds).extend({});
