import { PickType } from '@nestjs/swagger';
import { TokensResponse } from '../../../tokens/dto/responses/token.response';

export default class LogoutResponse extends PickType(TokensResponse, [
  'refresh_token',
]) {}
