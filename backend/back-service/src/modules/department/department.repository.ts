import { dataSource } from '@core/data-source';
import { Department } from 'erp-db';

export const DepartmentRepository = dataSource.getRepository(Department).extend({});
