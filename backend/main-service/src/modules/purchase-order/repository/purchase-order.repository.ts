import { dataSource } from '@core/data-source';
import { PurchaseOrder } from 'erp-db';

export const purchaseOrderRepository = dataSource
  .getRepository(PurchaseOrder)
  .extend({});
