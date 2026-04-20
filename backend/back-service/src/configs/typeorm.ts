import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const typeOrmConfig = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      join(
        __dirname,
        '..',
        '..',
        'node_modules/erp-db',
        '**',
        'dist/entities/*.{ts,js}',
      ),
      join(__dirname, '..', '**', '*.entity.{ts,js}'),
      join(__dirname, '..', '**', 'entities/*.{ts,js}'),
      //join(__dirname, '..', '..', 'db', 'entities/*.{ts,js}'),
    ],
    synchronize: false
  };
};
