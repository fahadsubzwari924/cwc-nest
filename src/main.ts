import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './core/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn'],
  });

  app.enableCors();

  /* setting up api prefix for all routes i.e /api/v1/customers */
  app.setGlobalPrefix('api/v1');

  /* setting up swagger documentation */
  const config = new DocumentBuilder()
    .setTitle('CustomizeWithClass')
    .setDescription('Customize with class api documentation')
    .setVersion('1.0')
    .addTag('cwc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
}
bootstrap();
