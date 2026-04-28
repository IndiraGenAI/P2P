import { dataSource } from '@core/data-source';
import { ItemCategory } from 'erp-db';

export const ItemCategoryRepository = dataSource
  .getRepository(ItemCategory)
  .extend({});
