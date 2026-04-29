import { dataSource } from '@core/data-source';
import { PaymentTerm } from 'erp-db';

export const paymentTermRepository = dataSource
  .getRepository(PaymentTerm)
  .extend({});
