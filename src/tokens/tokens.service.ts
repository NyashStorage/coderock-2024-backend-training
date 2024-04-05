import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type JwtPayload from './dto/jwt-payload.dto';
import type { TokensResponse } from './dto/responses/token.response';
import type { FastifyReply } from 'fastify';

@Injectable()
export default class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  public generateTokens(payload: JwtPayload): TokensResponse {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),

      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  /**
   * @throws UnauthorizedException Токен обновления не указан.
   * @throws UnauthorizedException Токен обновления устарел.
   */
  public refreshTokens(refreshToken: string | null): TokensResponse {
    if (!refreshToken)
      throw new UnauthorizedException(
        'Токен обновления не указан, авторизуйтесь в своём аккаунте.',
      );

    let decodedData: JwtPayload;
    try {
      decodedData = this.verifyToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(
        'Токен обновления устарел, аваторизуйтесь в своём аккаунте повторно.',
      );
    }

    if (!decodedData.userId)
      throw new UnauthorizedException(
        'Токен обновления устарел, аваторизуйтесь в своём аккаунте повторно.',
      );

    return this.generateTokens(decodedData);
  }

  /**
   * Получает данные из токена.
   * @throws Error
   */
  public verifyToken(token: string): JwtPayload | any {
    const payload = this.jwtService.verify(token);

    delete payload['iat'];
    delete payload['exp'];

    return payload;
  }

  /**
   * Устанавливает в куки токен обновления.
   */
  public prepareTokenCookie(
    refreshToken: string,
    response: FastifyReply,
  ): void {
    response.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  /**
   * Очищает токен обновления в куки.
   */
  public invalidateTokenCookie(response: FastifyReply): void {
    response.clearCookie('refresh_token');
  }
}
