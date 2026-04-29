import { dataSource } from '@core/data-source';
import { TermsCondition } from 'erp-db';

export const TermsConditionRepository = dataSource
  .getRepository(TermsCondition)
  .extend({});
