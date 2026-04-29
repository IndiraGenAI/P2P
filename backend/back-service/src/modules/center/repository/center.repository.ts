import { dataSource } from '@core/data-source';
import { Center } from 'erp-db';

export const centerRepository = dataSource.getRepository(Center).extend({});
