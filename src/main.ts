import { NestFactory } from '@nestjs/core';
import AppModule from './app/app.module';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { fastifyCookie } from '@fastify/cookie';

(async (): Promise<any> => {
  const logger = new Logger('Main');

  try {
    // Подготавливаем модули и сервисы.
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    const configService = app.get(ConfigService);

    // Настраиваем приложение.
    app.setGlobalPrefix('api/v1');

    await app.register(fastifyCookie, {
      secret: configService.get('cookie_secret'),
    });

    app.enableCors({
      origin: '*',
      credentials: true,
      exposedHeaders: 'X-Access-Token',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        // Преобразовывает plain object в типизированный объект.
        transform: true,
        // Не засчитывает поля запроса, у которых нет декоратора проверки.
        whitelist: true,
      }),
    );

    // Подключаем документацию.
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('CodeRock 2024')
          .setVersion(configService.get('API_VERSION') || '1.0.0')
          .addBearerAuth()
          .build(),
      ),
    );

    // Запускаем приложение.
    const port = configService.get('API_PORT') || 3000;
    await app.listen(port, '0.0.0.0');

    logger.log(`HTTP сервер запущен на порту ${port}.`);
  } catch (exception: any) {
    logger.error(
      `Что-то пошло не так при запуске приложения: ${exception.stack}.`,
    );
  }
})();
