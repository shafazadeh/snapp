import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // اینجا مشخص میکنیم که این اپ یه میکروسرویس هست
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { transport: Transport.TCP, options: { host: '127.0.0.1', port: 4000 } },
  );
  await app.listen();
}
bootstrap();
