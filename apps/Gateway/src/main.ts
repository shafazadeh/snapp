/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { setupSwagger } from '../config/swagger.config';
import cookieParser from 'cookie-parser';
import config from 'config';
const serviceOptions: any = config.get('server');

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  //config

  setupSwagger(app, config);

  await app.listen(serviceOptions.port);
  console.log(`🚀 Server running on port ${serviceOptions.port}`);
}
bootstrap();
