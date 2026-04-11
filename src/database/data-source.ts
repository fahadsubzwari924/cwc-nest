import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [__dirname + '/../entities/**/*.entity.js'],
  migrations: [__dirname + '/migrations/**/*.js'],
  ssl: { rejectUnauthorized: false },
  extra: {
    sslmode: 'require',
  },
  schema: 'public',
});
