import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import User from './decorators/user.decorator';
import UserEntity from './entities/user.entity';
import { MapInterceptor } from 'automapper-nestjs';
import UserResponse from './dto/responses/user.response';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import RequireAuthorization from '../auth/decorators/require-authorization.decorator';
import ApiErrorResponse from '../app/decorators/api-error-response.decorator';

@RequireAuthorization()
@ApiTags('Users')
@Controller('users')
export default class UsersController {
  @ApiOperation({ summary: 'Получить информацию о своём аккаунте' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'Недопустимый токен доступа')
  @Get('me')
  @UseInterceptors(MapInterceptor(UserEntity, UserResponse))
  me(@User() user: UserEntity): UserEntity {
    return user;
  }
}
