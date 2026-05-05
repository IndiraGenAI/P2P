import { dataSource } from '@core/data-source';
import { RateContract } from 'erp-db';

export const rateContractRepository = dataSource
  .getRepository(RateContract)
  .extend({});
