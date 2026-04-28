import { dataSource } from '@core/data-source';
import { City } from 'erp-db';

export const CityRepository = dataSource.getRepository(City).extend({});
