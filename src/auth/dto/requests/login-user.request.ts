import { PickType } from '@nestjs/swagger';
import RegisterUserRequest from './register-user.request';

export default class LoginUserRequest extends PickType(RegisterUserRequest, [
  'password',
  'username',
]) {}
