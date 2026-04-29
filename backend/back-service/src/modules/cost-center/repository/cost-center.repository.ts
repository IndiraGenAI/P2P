import { dataSource } from '@core/data-source';
import { CostCenter } from 'erp-db';

export const costCenterRepository = dataSource.getRepository(CostCenter).extend({});
