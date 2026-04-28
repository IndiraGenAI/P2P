import { dataSource } from '@core/data-source';
import { EntityMaster } from 'erp-db';

export const EntityRepository = dataSource
  .getRepository(EntityMaster)
  .extend({});
