/**
 * Generates OpenAPI JSON from the live Nest app graph (matches Swagger in main.ts).
 * Requires valid PostgreSQL env vars in .env or the shell (TypeORM may connect on startup).
 *
 * Usage: npm run docs:openapi
 * Output: docs/openapi/openapi.json
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generate(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('CustomizeWithClass')
    .setDescription('Customize with class API — generated OpenAPI document')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('cwc')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outDir = path.join(__dirname, '..', 'docs', 'openapi');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'openapi.json');
  fs.writeFileSync(outFile, JSON.stringify(document, null, 2), 'utf8');

  await app.close();
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outFile}`);
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
