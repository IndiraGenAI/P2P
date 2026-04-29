import { dataSource } from '@core/data-source';
import { Zone } from 'erp-db';

export const zoneRepository = dataSource.getRepository(Zone).extend({});
