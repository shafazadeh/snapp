import { Global, Module } from '@nestjs/common';
import { AppSocketGateway } from './socket.gateway';
import { SocketAuthGuard } from './socket.guard';

@Global()
@Module({
  imports: [],
  providers: [AppSocketGateway, SocketAuthGuard],
  exports: [AppSocketGateway],
})
export class SocketModule {}
