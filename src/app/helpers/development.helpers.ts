import * as process from 'process';

/**
 * Проверяет наличие аргумента "watch" в скрипте запуска.
 */
export function isDevelopmentMode(): boolean {
  return !!process.env.npm_lifecycle_script?.includes('watch');
}
