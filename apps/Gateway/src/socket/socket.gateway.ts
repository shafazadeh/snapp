/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketAuthGuard } from './socket.guard';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('SocketGateway');

  constructor(private readonly socketAuthGuard: SocketAuthGuard) {}

  async handleConnection(client: Socket) {
    const allowed = await this.socketAuthGuard.canActivate({
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as any);

    if (!allowed) return;

    const { acc_type, driver, passenger } = client.data;

    if (acc_type === 'DRIVER') {
      client.join('drivers');
      client.join(`driver_${driver.id}`);
      this.logger.log(`Driver ${driver.id} connected (socket ${client.id})`);
    }

    if (acc_type === 'PASSENGER') {
      client.join(`passenger_${passenger.id}`);
      this.logger.log(
        `Passenger ${passenger.id} connected (socket ${client.id})`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async handleDisconnect(client: Socket) {
    const { acc_type, driver, passenger } = client.data;

    if (acc_type === 'DRIVER') {
      this.logger.log(`Driver ${driver.id} disconnected`);
    }

    if (acc_type === 'PASSENGER') {
      this.logger.log(`Passenger ${passenger.id} disconnected`);
    }
  }

  @SubscribeMessage('driver:location')
  handleLocation(
    @MessageBody() data: { lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    const driver = client.data.driver;
    if (!driver) return;

    this.server.emit('driver:location:update', {
      driverId: driver.id,
      ...data,
    });

    this.logger.log(
      `Location update from driver ${driver.id}: ${data.lat}, ${data.lng}`,
    );
  }
}
