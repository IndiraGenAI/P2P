import { dataSource } from '@core/data-source';
import { RateContractDocument } from 'erp-db';

export const rateContractDocumentRepository = dataSource
  .getRepository(RateContractDocument)
  .extend({});
