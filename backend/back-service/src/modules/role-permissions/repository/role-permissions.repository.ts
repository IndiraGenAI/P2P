import { dataSource } from '@core/data-source';
import { RolePermissions } from 'erp-db';

export const rolePermissionsRepository = dataSource
  .getRepository(RolePermissions)
  .extend({});
