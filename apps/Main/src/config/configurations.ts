import { registerAs } from '@nestjs/config';

const DatabaseConfig = registerAs('Database', () => ({
  // این اطلاعات از فایل داکر موقع ساخت دیتابیس هست
  database: 'snappdb',
  username: 'snapp',
  password: 'snapp_pass',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
}));

const RedisConfig = registerAs('Redis', () => ({
  host: '127.0.0.1',
  port: 63799,
  cacheDb: 10,
  session: 11,
}));

export const configurations = [DatabaseConfig, RedisConfig];
