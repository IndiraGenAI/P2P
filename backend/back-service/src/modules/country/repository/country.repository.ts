import { dataSource } from '@core/data-source';
import { Country } from 'erp-db';

export const countryRepository = dataSource.getRepository(Country).extend({});
