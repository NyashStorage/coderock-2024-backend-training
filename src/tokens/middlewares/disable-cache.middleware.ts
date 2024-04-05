import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Добавляет заголовок, отключающий кэширование запроса, если отправлен новый токен доступа.
 */
@Injectable()
export class DisableCacheMiddleware implements NestMiddleware {
  use(_: FastifyRequest, response: FastifyReply, next: () => any): void {
    if (response.hasHeader('x-access-token'))
      response.header('Cache-Control', 'no-store');

    next();
  }
}
