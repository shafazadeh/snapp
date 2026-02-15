import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
import { UtilsModule } from './utils/utils.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [RestModule, ServiceModule, UtilsModule, SocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
