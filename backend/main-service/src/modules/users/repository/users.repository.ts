import { dataSource } from '@core/data-source';
import { Users } from 'erp-db';

export const UsersRepository = dataSource.getRepository(Users).extend({});
