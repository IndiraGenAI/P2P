import { dataSource } from '@core/data-source';
import { Subdepartment } from 'erp-db';

export const SubdepartmentRepository = dataSource
  .getRepository(Subdepartment)
  .extend({});
