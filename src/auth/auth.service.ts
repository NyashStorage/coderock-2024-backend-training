import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type RegisterUserRequest from './dto/requests/register-user.request';
import type { TokensResponse } from '../tokens/dto/responses/token.response';
import TokensService from '../tokens/tokens.service';
import UsersRepository from '../users/repositories/users.repository';
import md5 from 'md5';
import type LoginUserRequest from './dto/requests/login-user.request';

@Injectable()
export default class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * @throws BadRequestException Пользователь уже зарегистрирован.
   */
  public async register(dto: RegisterUserRequest): Promise<TokensResponse> {
    let user = await this.usersRepository.getByUsername(dto.username);
    if (user)
      throw new BadRequestException(
        `Пользователь "${user.username}" уже зарегистрирован.`,
      );

    user = await this.usersRepository.create({
      username: dto.username,
      password: md5(dto.password),
    });

    return this.tokensService.generateTokens({
      userId: user.id,
    });
  }

  /**
   * @throws NotFoundException Пользователь не найден.
   * @throws UnauthorizedException Пароль указан неверно.
   */
  public async login(dto: LoginUserRequest): Promise<TokensResponse> {
    const user = await this.usersRepository.getByUsername(dto.username);
    if (!user)
      throw new NotFoundException(`Пользователь "${dto.username}" не найден.`);

    const hash = md5(dto.password);
    if (hash !== user.password)
      throw new UnauthorizedException('Пароль указан неверно.');

    // TODO: Добавить ограничение на неверные попытки ввода пароля.

    return this.tokensService.generateTokens({
      userId: user.id,
    });
  }
}
