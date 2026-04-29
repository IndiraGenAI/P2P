import { dataSource } from '@core/data-source';
import { Pages, RolePermissions, Roles } from 'erp-db';

export const rolesRepository = dataSource.getRepository(Roles).extend({});
export const pagesRepository = dataSource.getRepository(Pages).extend({});
export const rolePermissionsRepository = dataSource
  .getRepository(RolePermissions)
  .extend({});
