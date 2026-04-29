import { dataSource } from '@core/data-source';
import { TermsCondition } from 'erp-db';

export const termsConditionRepository = dataSource
  .getRepository(TermsCondition)
  .extend({});
