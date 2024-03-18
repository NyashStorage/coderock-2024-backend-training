import type { DataSourceOptions } from 'typeorm';
import * as process from 'process';
import configuration from '../config/configuration';
import { isDevelopmentMode } from '../app/helpers/development.helpers';

// Подгружаем данные из файла .env в process.env.
configuration();

const options: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  logging: isDevelopmentMode() ? ['query'] : ['error'],
  entities: [],
  migrations: [],
};

export default options;
