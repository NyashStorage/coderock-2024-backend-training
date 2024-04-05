import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export default class RegisterUserRequest {
  @ApiProperty({
    minLength: 3,
  })
  @IsString()
  @Length(3, undefined, {
    message: (args) =>
      `Имя пользователя должно быть длиннее ${args.constraints[0]} символов.`,
  })
  username: string;

  @ApiProperty({
    minLength: 6,
    maxLength: 64,
  })
  @IsString()
  @Length(3, 64, {
    message: (args) =>
      `Пароль должен быть длинее ${args.constraints[0]}, но короче ${args.constraints[1]} символов.`,
  })
  password: string;
}
