import { dataSource } from '@core/data-source';
import { Voucher } from 'erp-db';

export const VoucherRepository = dataSource.getRepository(Voucher).extend({});
