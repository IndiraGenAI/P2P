import { dataSource } from '@core/data-source';
import { Roles } from 'erp-db';

export const RolesRepository = dataSource.getRepository(Roles).extend({});
