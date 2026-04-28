import { dataSource } from '@core/data-source';
import { PurchaseRequestItem } from 'erp-db';

export const PurchaseRequestItemRepository = dataSource
  .getRepository(PurchaseRequestItem)
  .extend({});
