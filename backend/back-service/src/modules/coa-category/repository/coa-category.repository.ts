import { dataSource } from '@core/data-source';
import { CoaCategory } from 'erp-db';

export const coaCategoryRepository = dataSource
  .getRepository(CoaCategory)
  .extend({});
