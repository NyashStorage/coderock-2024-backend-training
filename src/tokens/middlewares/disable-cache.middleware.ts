import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { setHeader } from '../../helpers/response.helpers';

/**
 * Добавляет заголовок, отключающий кэширование запроса, если отправлен новый токен доступа.
 */
@Injectable()
export class DisableCacheMiddleware implements NestMiddleware {
  use(
    _: FastifyRequest,
    response: FastifyReply | ServerResponse,
    next: () => any,
  ): void {
    if (response.hasHeader('x-access-token'))
      setHeader(response, 'Cache-Control', 'no-store');

    next();
  }
}
