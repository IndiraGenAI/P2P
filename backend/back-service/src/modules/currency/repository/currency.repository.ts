import { dataSource } from '@core/data-source';
import { Currency } from 'erp-db';

export const currencyRepository = dataSource.getRepository(Currency).extend({});
