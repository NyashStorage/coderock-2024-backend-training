import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import TokensService from './tokens.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
      }),
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export default class TokensModule {}
