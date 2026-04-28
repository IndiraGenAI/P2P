import { dataSource } from '@core/data-source';
import { RolePermissions } from 'erp-db';

export const RolePermissionsRepository = dataSource
  .getRepository(RolePermissions)
  .extend({});
