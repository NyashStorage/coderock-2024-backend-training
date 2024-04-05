import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import TokensService from '../../tokens/tokens.service';
import UsersRepository from '../../users/repositories/users.repository';
import type UserEntity from '../../users/entities/user.entity';
import type JwtPayload from '../../tokens/dto/jwt-payload.dto';

/**
 * Проверяет наличие токена доступа в запросе и его действительность.
 */
@Injectable()
export default class TokenGuard implements CanActivate {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest<FastifyRequest>();

    const userId = this.getUserId(request);
    await this.embedUser(request, userId);

    return true;
  }

  /**
   * Получает ID пользователя из запроса по токену доступа.
   * @throws UnauthorizedException Токен доступа не указан.
   * @throws UnauthorizedException Токен доступа не содержит ID пользовтаеля.
   */
  public getUserId(request: FastifyRequest): number {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Токен доступа не указан.');

    // Обрезаем "Bearer" из заголовка.
    const accessToken = authHeader?.slice(7);

    let payload: JwtPayload;
    try {
      payload = this.tokensService.verifyToken(accessToken);
    } catch (_) {
      throw new UnauthorizedException('Токен доступа устарел.');
    }

    if (!payload.userId)
      throw new UnauthorizedException(
        'Токен доступа не содержит ID пользовтаеля.',
      );

    return payload.userId;
  }

  /**
   * Встраивает данные пользователя в запрос, находя их по ID.
   * @throws UnauthorizedException Пользователь не найден.
   */
  public async embedUser(
    request: FastifyRequest,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.getById(userId);
    if (!user) throw new UnauthorizedException('Пользователь не найден.');

    request['user'] = user;
    return user;
  }
}
