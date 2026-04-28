import { dataSource } from '@core/data-source';
import { PurchaseRequestDocument } from 'erp-db';

export const PurchaseRequestDocumentRepository = dataSource
  .getRepository(PurchaseRequestDocument)
  .extend({});
