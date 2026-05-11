import { dataSource } from '@core/data-source';
import { PurchaseOrderItem } from 'erp-db';

export const purchaseOrderItemRepository = dataSource
  .getRepository(PurchaseOrderItem)
  .extend({});
