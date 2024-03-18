import { config } from 'dotenv';
import type { DotenvExpandOutput } from 'dotenv-expand';
import { expand } from 'dotenv-expand';

// Подгружаем данные из файла .env в process.env, заполняя плейсхолдеры.
export default (): DotenvExpandOutput => expand(config());
