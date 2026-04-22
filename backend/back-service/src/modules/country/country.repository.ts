import { dataSource } from '@core/data-source';
import { Country } from 'erp-db';

export const CountryRepository = dataSource.getRepository(Country).extend({});
