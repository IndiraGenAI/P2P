import { dataSource } from '@core/data-source';
import { Item } from 'erp-db';

export const itemRepository = dataSource.getRepository(Item).extend({});
