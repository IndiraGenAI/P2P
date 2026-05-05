import { dataSource } from '@core/data-source';
import { PurchaseRequest } from 'erp-db';

export const purchaseRequestRepository = dataSource
  .getRepository(PurchaseRequest)
  .extend({});
