import { dataSource } from '@core/data-source';
import { City } from 'erp-db';

export const cityRepository = dataSource.getRepository(City).extend({});
