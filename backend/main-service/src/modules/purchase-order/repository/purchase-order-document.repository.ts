import { dataSource } from '@core/data-source';
import { PurchaseOrderDocument } from 'erp-db';

export const purchaseOrderDocumentRepository = dataSource
  .getRepository(PurchaseOrderDocument)
  .extend({});
