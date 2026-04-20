import { HttpExceptionFilter } from '@core/middleware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.PREFIX || '/');
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: false }),
  );
  // remove CORS
  app.enableCors();

  if (process.env.MODE === 'DEV') {
    // Swagger
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

  // app.useGlobalFilters(new QueryFailedExceptionFilter());
  const port = process.env.PORT || 3010;
  console.log('port ', port);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}
bootstrap();
