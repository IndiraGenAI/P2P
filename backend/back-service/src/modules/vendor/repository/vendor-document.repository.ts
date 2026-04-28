import { dataSource } from '@core/data-source';
import { VendorDocument } from 'erp-db';

export const VendorDocumentRepository = dataSource
  .getRepository(VendorDocument)
  .extend({});
