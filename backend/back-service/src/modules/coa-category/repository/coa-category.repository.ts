import { dataSource } from '@core/data-source';
import { CoaCategory } from 'erp-db';

export const CoaCategoryRepository = dataSource
  .getRepository(CoaCategory)
  .extend({});
