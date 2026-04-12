import * as path from 'path';
import { config as loadDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { isPgSslDisabled } from './pg-ssl.util';

// TypeORM CLI does not load Nest ConfigModule; pick up `.env` from cwd (npm run from repo root).
loadDotenv({ path: path.join(process.cwd(), '.env') });

const sslOff = isPgSslDisabled(process.env.PG_SSL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [__dirname + '/../entities/**/*.entity.js'],
  migrations: [__dirname + '/migrations/**/*.js'],
  schema: 'public',
  ...(sslOff
    ? {}
    : {
        ssl: { rejectUnauthorized: false },
        extra: { sslmode: 'require' },
      }),
});
