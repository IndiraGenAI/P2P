import { dataSource } from '@core/data-source';
import { ApplicantType } from 'erp-db';

export const applicantTypeRepository = dataSource
  .getRepository(ApplicantType)
  .extend({});
