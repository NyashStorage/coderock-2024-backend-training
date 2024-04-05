import type { DataSourceOptions } from 'typeorm';
import * as process from 'process';
import configuration from '../config/configuration';
import UserEntity from '../users/entities/user.entity';
import { AddUserEntity1712270424185 } from './migrations/1712270424185-AddUserEntity';

// Подгружаем данные из файла .env в process.env.
configuration();

const options: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [UserEntity],
  migrations: [AddUserEntity1712270424185],
};

export default options;
