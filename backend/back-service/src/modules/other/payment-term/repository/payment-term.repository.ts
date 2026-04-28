import { dataSource } from '@core/data-source';
import { PaymentTerm } from 'erp-db';

export const PaymentTermRepository = dataSource
  .getRepository(PaymentTerm)
  .extend({});
