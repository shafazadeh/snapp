import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setUpSwagger } from './config/swagger.config';

async function bootstrap() {
  // چون میخوایم کنترل کامل سرورمون که express هست دست خودمون باشه
  // به جای اینکه ساخت سرور رو به نست بدیم
  // خودمون از express نمونه میسازیم
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const configService = app.get(ConfigService);

  const port = configService.get('App.port') as number;

  setUpSwagger(app, configService);
  await app.listen(port);
}
bootstrap();
