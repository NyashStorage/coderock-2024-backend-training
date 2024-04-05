import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';

export default class UserResponse {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  username: string;
}
