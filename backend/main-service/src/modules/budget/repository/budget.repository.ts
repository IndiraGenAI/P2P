import { dataSource } from '@core/data-source';
import { Budget } from 'erp-db';

export const budgetRepository = dataSource.getRepository(Budget).extend({});
