import { ApiProperty, PickType } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    description: 'Токен для доступа к защищённым методам API',
  })
  access_token: string;
}

export class TokensResponse extends PickType(TokenResponse, ['access_token']) {
  refresh_token: string;
}
