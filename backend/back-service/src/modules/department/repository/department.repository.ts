import { dataSource } from '@core/data-source';
import { Department } from 'erp-db';

export const departmentRepository = dataSource.getRepository(Department).extend({});
