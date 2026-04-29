import { dataSource } from '@core/data-source';
import { Voucher } from 'erp-db';

export const voucherRepository = dataSource.getRepository(Voucher).extend({});
