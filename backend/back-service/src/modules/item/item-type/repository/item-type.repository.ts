import { dataSource } from '@core/data-source';
import { ItemType } from 'erp-db';

export const ItemTypeRepository = dataSource.getRepository(ItemType).extend({});
