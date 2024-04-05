import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

/**
 * Получает данные отправителя запроса.
 */
const User = createParamDecorator((_: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest()['user'];
});

export default User;
