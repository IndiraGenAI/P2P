import { dataSource } from '@core/data-source';
import { Zone } from 'erp-db';

export const ZoneRepository = dataSource.getRepository(Zone).extend({});
