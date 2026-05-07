import { dataSource } from '@core/data-source';
import { GrnInvoiceDocument } from 'erp-db';

export const grnInvoiceDocumentRepository = dataSource
  .getRepository(GrnInvoiceDocument)
  .extend({});
