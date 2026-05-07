import { dataSource } from '@core/data-source';
import { GrnInvoiceItem } from 'erp-db';

export const grnInvoiceItemRepository = dataSource.getRepository(GrnInvoiceItem).extend({});
