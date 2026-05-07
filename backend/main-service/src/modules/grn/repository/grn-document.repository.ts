import { dataSource } from '@core/data-source';
import { GrnDocument } from 'erp-db';

export const grnDocumentRepository = dataSource
  .getRepository(GrnDocument)
  .extend({});
