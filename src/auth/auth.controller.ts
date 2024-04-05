import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import RegisterUserRequest from './dto/requests/register-user.request';
import AuthService from './auth.service';
import type { TokensResponse } from '../tokens/dto/responses/token.response';
import { TokenResponse } from '../tokens/dto/responses/token.response';
import LoginUserRequest from './dto/requests/login-user.request';
import LogoutResponse from './dto/responses/logout.response';
import { TokenInterceptor } from '../tokens/interceptors/token.interceptor';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import ApiErrorResponse from '../app/decorators/api-error-response.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(TokenInterceptor)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Зарегистрироваться' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Пользователь уже зарегистрирован')
  @Post('register')
  register(@Body() dto: RegisterUserRequest): Promise<TokensResponse> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Авторизоваться' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Пользователь не найден')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'Пароль указан неверно')
  @Post('login')
  login(@Body() dto: LoginUserRequest): Promise<TokensResponse> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Выйти из аккаунта' })
  @ApiOkResponse({ status: 200 })
  @Delete()
  logout(): LogoutResponse {
    return { refresh_token: 'invalidate' };
  }
}
