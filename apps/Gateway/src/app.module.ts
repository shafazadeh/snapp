import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configurations';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RestModule, // درخواست های من رو مشخص میکنه که برای کدوم پنل هست
    ServiceModule, // برقراری ارتباط بین gateaway با سایر سرویس های برنامه
  ],
})
export class AppModule {}
