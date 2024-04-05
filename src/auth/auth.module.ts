import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import UsersModule from '../users/users.module';
import TokensModule from '../tokens/tokens.module';
import AuthService from './auth.service';
import TokenGuard from './guards/token.guard';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, TokenGuard],
  exports: [AuthService, TokenGuard],
})
export default class AuthModule {}
