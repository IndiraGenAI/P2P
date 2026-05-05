import { dataSource } from '@core/data-source';
import { PurchaseRequestItem } from 'erp-db';

export const purchaseRequestItemRepository = dataSource
  .getRepository(PurchaseRequestItem)
  .extend({});
