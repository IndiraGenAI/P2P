import { dataSource } from '@core/data-source';
import { VendorDocument } from 'erp-db';

export const vendorDocumentRepository = dataSource
  .getRepository(VendorDocument)
  .extend({});
