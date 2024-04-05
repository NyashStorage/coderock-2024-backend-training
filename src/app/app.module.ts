import type { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import DatabaseModule from '../database/database.module';
import UsersModule from '../users/users.module';
import AuthModule from '../auth/auth.module';
import { RefreshTokensMiddleware } from '../tokens/middlewares/refresh-tokens.middleware';
import { DisableCacheMiddleware } from '../tokens/middlewares/disable-cache.middleware';
import TokensModule from '../tokens/tokens.module';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TokensModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
})
export default class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RefreshTokensMiddleware).forRoutes('*');
    consumer.apply(DisableCacheMiddleware).forRoutes('*');
  }
}
