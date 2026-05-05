import { dataSource } from '@core/data-source';
import { RateContractItem } from 'erp-db';

export const rateContractItemRepository = dataSource
  .getRepository(RateContractItem)
  .extend({});
