import { dataSource } from '@core/data-source';
import { PurchaseRequestDocument } from 'erp-db';

export const purchaseRequestDocumentRepository = dataSource
  .getRepository(PurchaseRequestDocument)
  .extend({});
