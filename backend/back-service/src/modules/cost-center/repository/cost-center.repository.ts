import { dataSource } from '@core/data-source';
import { CostCenter } from 'erp-db';

export const CostCenterRepository = dataSource.getRepository(CostCenter).extend({});
