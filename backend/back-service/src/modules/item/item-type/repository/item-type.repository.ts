import { dataSource } from '@core/data-source';
import { ItemType } from 'erp-db';

export const itemTypeRepository = dataSource.getRepository(ItemType).extend({});
