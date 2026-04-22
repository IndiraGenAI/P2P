import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { APP_ENV } from './env.config';

export const typeOrmConfig = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: APP_ENV.db.host,
    port: APP_ENV.db.port,
    username: APP_ENV.db.username,
    password: APP_ENV.db.password,
    database: APP_ENV.db.database,
    ssl: APP_ENV.db.ssl ? { rejectUnauthorized: false } : false,
    extra: APP_ENV.db.ssl ? { ssl: { rejectUnauthorized: false } } : undefined,
    entities: [




      join(
        __dirname,
        '..',
        '..',
        'node_modules',
        'erp-db',
        'dist',
        'entities',
        '*.{ts,js}',
      ),
      join(__dirname, '..', '**', '*.entity.{ts,js}'),
      join(__dirname, '..', '**', 'entities/*.{ts,js}'),
    ],
    synchronize: false,
  };
};
