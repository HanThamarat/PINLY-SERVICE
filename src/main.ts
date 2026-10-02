import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { appDataSource } from './libs/datasource.js';
import { redisInitialize } from './libs/redis.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    trustedOrigins: ['*'],
  });

  await appDataSource.initialize();
  await redisInitialize();
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
