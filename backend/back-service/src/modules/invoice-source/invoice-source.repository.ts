import { dataSource } from '@core/data-source';
import { InvoiceSource } from 'erp-db';

export const InvoiceSourceRepository = dataSource
  .getRepository(InvoiceSource)
  .extend({});
