import { dataSource } from '@core/data-source';
import { GrnItem } from 'erp-db';

export const grnItemRepository = dataSource.getRepository(GrnItem).extend({});
