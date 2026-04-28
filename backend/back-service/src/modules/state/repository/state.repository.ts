import { dataSource } from '@core/data-source';
import { State } from 'erp-db';

export const StateRepository = dataSource.getRepository(State).extend({});
