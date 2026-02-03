import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MainServiceClient } from './main.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Main',
        transport: Transport.TCP, // یعنی سرویس میخواد مستقیما و بدون واسطهه با هم صحبت کنن
        // بدون rabbitMq , kafka
        options: {
          host: '127.0.0.1',
          port: 4000,
        },
      },
    ]),
  ],
  providers: [MainServiceClient],
  exports: [MainServiceClient],
})
export class ServiceModule {}
