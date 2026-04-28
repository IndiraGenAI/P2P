import { dataSource } from '@core/data-source';
import { ApplicantType } from 'erp-db';

export const ApplicantTypeRepository = dataSource
  .getRepository(ApplicantType)
  .extend({});
