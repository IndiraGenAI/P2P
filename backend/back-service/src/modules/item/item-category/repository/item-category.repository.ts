import { dataSource } from '@core/data-source';
import { ItemCategory } from 'erp-db';

export const itemCategoryRepository = dataSource
  .getRepository(ItemCategory)
  .extend({});
