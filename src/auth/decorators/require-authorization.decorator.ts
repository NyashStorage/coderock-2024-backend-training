import { applyDecorators, UseGuards } from '@nestjs/common';
import TokenGuard from '../guards/token.guard';

/**
 * Отмечает необходимость авторизации, прикрепляя соответствующие guards.
 */
export default function RequireAuthorization(): any {
  return applyDecorators(UseGuards(TokenGuard));
}
