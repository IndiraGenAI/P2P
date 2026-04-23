import { dataSource } from '@core/data-source';
import { Tds } from 'erp-db';

export const TdsRepository = dataSource.getRepository(Tds).extend({});
