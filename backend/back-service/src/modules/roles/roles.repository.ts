import { dataSource } from '@core/data-source';
import { Pages, RolePermissions, Roles } from 'erp-db';

export const RolesRepository = dataSource.getRepository(Roles).extend({});
export const PagesRepository = dataSource.getRepository(Pages).extend({});
export const RolePermissionsRepository = dataSource
  .getRepository(RolePermissions)
  .extend({});
