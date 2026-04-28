import { dataSource } from '@core/data-source';
import { PurchaseRequest } from 'erp-db';

export const PurchaseRequestRepository = dataSource
  .getRepository(PurchaseRequest)
  .extend({});
