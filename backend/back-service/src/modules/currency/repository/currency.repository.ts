import { dataSource } from '@core/data-source';
import { Currency } from 'erp-db';

export const CurrencyRepository = dataSource.getRepository(Currency).extend({});
