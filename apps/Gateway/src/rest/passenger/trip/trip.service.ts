/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { handleSrvCliResponse } from 'src/response/httpExceeption.filter';
import { MainServiceClient } from 'src/services/main.service';
import { AppSocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class PassengerTripService {
  constructor(
    private readonly mainSrvCli: MainServiceClient,
    private readonly socketGateway: AppSocketGateway,
  ) {}

  async createTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'create',
      query: data,
    });
    this.socketGateway.server.to('drivers').emit('trip:new', res.data);
    return handleSrvCliResponse(res);
  }

  // async cancelTrip(data: any) {
  //   const res = await this.mainSrvCli.callAction({
  //     provider: 'TRIPS',
  //     action: 'cancelByPassenger',
  //     query: data,
  //   });

  //   const trip = res.data;

  //   this.socketGateway.server.to(`drivers`).emit('trip:cancelled', {
  //     tripId: trip.id,
  //     cancelledBy: 'PASSENGER',
  //   });

  //   return handleSrvCliResponse(res);
  // }
}
