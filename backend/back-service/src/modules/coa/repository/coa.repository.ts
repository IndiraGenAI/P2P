import { dataSource } from '@core/data-source';
import { Coa } from 'erp-db';

export const CoaRepository = dataSource.getRepository(Coa).extend({});
