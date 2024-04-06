import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import TokensService from '../tokens.service';
import TokenGuard from '../../auth/guards/token.guard';
import type { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { fastifyCookie } from '@fastify/cookie';
import { ServerResponse } from 'http';
import { setHeader } from '../../helpers/response.helpers';

/**
 * Автоматически обновляет токен доступа без прерывания запроса, если это возможно.
 */
@Injectable()
export class RefreshTokensMiddleware implements NestMiddleware {
  constructor(
    private readonly tokensService: TokensService,
    private readonly tokenGuard: TokenGuard,
  ) {}

  async use(
    request: FastifyRequest,
    response: FastifyReply | ServerResponse,
    next: () => any,
  ): Promise<void> {
    if (!request.headers.cookie) return next();

    const cookies = fastifyCookie.parse(request.headers.cookie);
    // Если нет токена обновления - авторизации точно не было.
    if (!cookies?.['refresh_token']) return next();

    // Если токен доступа проходит защиту авторизации - пропускаем запрос дальше.
    try {
      await this.tokenGuard.canActivate(this.mockContext(request, next));

      return next();
    } catch (_) {}

    // Обновляем токены по токену обновления из куки.
    const refreshToken = cookies['refresh_token'];
    const updatedTokens = this.tokensService.refreshTokens(refreshToken);

    // Устанавливаем новый токен доступа в текущий запрос
    // и прогоняем через защиту авторизации, чтобы установить user.
    request.headers.authorization = `Bearer ${updatedTokens.access_token}`;
    await this.tokenGuard.canActivate(this.mockContext(request, next));

    // Отправляем новые токены пользователю.
    this.tokensService.prepareTokenCookie(
      updatedTokens.refresh_token,
      response,
    );

    setHeader(response, 'X-Access-Token', updatedTokens.access_token);
    next();
  }

  private mockContext(
    request: FastifyRequest,
    next: () => any,
  ): ExecutionContextHost {
    return {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => null,
        getNext: () => next,
      }),
    } as ExecutionContextHost;
  }
}
