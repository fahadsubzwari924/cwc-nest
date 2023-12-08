import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './core/filters/exception.filter';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn'],
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;

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

  // Import AuthModule and apply global authentication guard
  const authModule = app.select(AuthModule);
  app.useGlobalGuards(authModule.get(AuthGuard));

  await app.listen(PORT);
}
bootstrap();
