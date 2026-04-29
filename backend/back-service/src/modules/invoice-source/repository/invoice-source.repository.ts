import { dataSource } from '@core/data-source';
import { InvoiceSource } from 'erp-db';

export const invoiceSourceRepository = dataSource
  .getRepository(InvoiceSource)
  .extend({});
