import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../configs/typeorm';
import { DataSource } from 'typeorm';

ConfigModule.forRoot();
export const dataSource = new DataSource(typeOrmConfig());

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized successfully.');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
