import { dataSource } from '@core/data-source';
import { GrnInvoice } from 'erp-db';

export const grnInvoiceRepository = dataSource.getRepository(GrnInvoice).extend({});
