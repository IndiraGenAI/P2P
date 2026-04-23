import { dataSource } from '@core/data-source';
import { Gst } from 'erp-db';

export const GstRepository = dataSource.getRepository(Gst).extend({});
