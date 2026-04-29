import { dataSource } from '@core/data-source';
import { Users } from 'erp-db';

export const usersRepository = dataSource.getRepository(Users).extend({});
