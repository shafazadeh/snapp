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

export const configurations = [DatabaseConfig];
