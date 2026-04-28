import { dataSource } from '@core/data-source';
import { Center } from 'erp-db';

export const CenterRepository = dataSource.getRepository(Center).extend({});
