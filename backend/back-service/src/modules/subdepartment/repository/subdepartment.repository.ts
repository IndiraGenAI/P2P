import { dataSource } from '@core/data-source';
import { Subdepartment } from 'erp-db';

export const subdepartmentRepository = dataSource
  .getRepository(Subdepartment)
  .extend({});
