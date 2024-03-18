import { DataSource } from 'typeorm';
import options from '../src/database/data-source-options';

// Создание DataSource для взаимодействия с TypeORM
// через командную строку, в нашем случае из скриптов package.json.
export default new DataSource(options);
