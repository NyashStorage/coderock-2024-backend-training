import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import TokensService from '../tokens.service';
import TokenGuard from '../../auth/guards/token.guard';
import type { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

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
    response: FastifyReply,
    next: () => any,
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    // Если токен проходит защиту авторизации - пропускаем его дальше.
    try {
      await this.tokenGuard.canActivate(
        this.mockContext(request, response, next),
      );

      return next();
    } catch (_) {}

    // Обновляем токены по токену обновления из куки.
    const refreshToken = request.cookies?.['refresh_token'] || null;
    const updatedTokens = this.tokensService.refreshTokens(refreshToken);

    // Устанавливаем новый токен доступа в текущий запрос
    // и прогоняем через защиту авторизации, чтобы установить user.
    request.headers.authorization = `Bearer ${updatedTokens.access_token}`;
    await this.tokenGuard.canActivate(
      this.mockContext(request, response, next),
    );

    // Отправляем новые токены пользователю.
    this.tokensService.prepareTokenCookie(
      updatedTokens.refresh_token,
      response,
    );

    response.header('X-Access-Token', updatedTokens.access_token);
    next();
  }

  private mockContext(
    request: FastifyRequest,
    response: FastifyReply,
    next: () => any,
  ): ExecutionContextHost {
    return {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
        getNext: () => next,
      }),
    } as ExecutionContextHost;
  }
}
