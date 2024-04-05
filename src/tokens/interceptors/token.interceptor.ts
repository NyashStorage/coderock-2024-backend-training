import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import TokensService from '../tokens.service';
import type { FastifyReply } from 'fastify';

/**
 * Переносит "refresh_token" из тела запроса в куки.
 */
@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly tokensService: TokensService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data) => {
        if (!data?.['refresh_token']) return data;

        const refreshToken = data.refresh_token;
        delete data['refresh_token'];

        // Удаляем старые куки, если встречено специальное слово.
        if (refreshToken === 'invalidate') {
          this.tokensService.invalidateTokenCookie(response);
          return data;
        }

        // Переносим токен из тела запроса в куки.
        this.tokensService.prepareTokenCookie(refreshToken, response);
        return data;
      }),
    );
  }
}
