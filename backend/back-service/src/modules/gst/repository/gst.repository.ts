import { dataSource } from '@core/data-source';
import { Gst } from 'erp-db';

export const gstRepository = dataSource.getRepository(Gst).extend({});
