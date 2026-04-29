import { dataSource } from '@core/data-source';
import { EntityMaster } from 'erp-db';

export const entityRepository = dataSource
  .getRepository(EntityMaster)
  .extend({});
