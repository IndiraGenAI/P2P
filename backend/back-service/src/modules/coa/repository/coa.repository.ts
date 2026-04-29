import { dataSource } from '@core/data-source';
import { Coa } from 'erp-db';

export const coaRepository = dataSource.getRepository(Coa).extend({});
