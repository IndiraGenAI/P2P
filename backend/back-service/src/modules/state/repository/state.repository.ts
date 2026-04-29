import { dataSource } from '@core/data-source';
import { State } from 'erp-db';

export const stateRepository = dataSource.getRepository(State).extend({});
