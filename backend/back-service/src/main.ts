import { HttpExceptionFilter } from '@core/middleware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APP_ENV } from './configs/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(APP_ENV.prefix);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: false }),
  );
  app.enableCors();

  if (APP_ENV.isDev()) {
    const config = new DocumentBuilder()
      .addBasicAuth()
      .addBearerAuth()
      .setTitle('ERP')
      .setDescription('Backend APIs')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(APP_ENV.port);
  console.log(
    `[P2P-ORG] Backend listening on http://localhost:${APP_ENV.port}${APP_ENV.prefix} (mode=${APP_ENV.mode})`,
  );
}
bootstrap();
