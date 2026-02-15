/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { handleSrvCliResponse } from 'src/response/httpExceeption.filter';
// import { handleSrvCliResponse } from 'src/response/httpException.filter';
import { MainServiceClient } from 'src/services/main.service';
import { AppSocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class DriverTripService {
  constructor(
    private readonly mainSrvCli: MainServiceClient,
    private readonly socketGateway: AppSocketGateway,
  ) {}

  async acceptTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'accept',
      query: data,
    });

    const trip = res.data;

    // Notify passenger
    this.socketGateway.server
      .to(`passenger_${trip.passengerId}`)
      .emit('trip:accepted', trip);

    return handleSrvCliResponse(res);
  }

  async arrivedTrip(data: any) {
    const res = await this.mainSrvCli.callAction({
      provider: 'TRIPS',
      action: 'arrived',
      query: data,
    });

    const trip = res.data;

    // Notify passenger
    this.socketGateway.server
      .to(`passenger_${trip.passengerId}`)
      .emit('trip:driver_arrived', {
        tripId: trip.id,
        driverId: trip.driverId,
        arrivedAt: trip.arrivedAt,
      });

    return handleSrvCliResponse(res);
  }

  // async startTrip(data: any) {
  //   const res = await this.mainSrvCli.callAction({
  //     provider: 'TRIPS',
  //     action: 'start',
  //     query: data,
  //   });

  //   const trip = res.data;

  //   // 🔔 notify passenger
  //   this.socketGateway.server
  //     .to(`passenger_${trip.passengerId}`)
  //     .emit('trip:started', {
  //       tripId: trip.id,
  //       driverId: trip.driverId,
  //       startedAt: trip.startedAt,
  //     });

  //   return handleSrvCliResponse(res);
  // }

  // async endTrip(data: any) {
  //   const res = await this.mainSrvCli.callAction({
  //     provider: 'TRIPS',
  //     action: 'end',
  //     query: data,
  //   });

  //   const trip = res.data;

  //   this.socketGateway.server
  //     .to(`passenger_${trip.passengerId}`)
  //     .emit('trip:ended', {
  //       tripId: trip.id,
  //       driverId: trip.driverId,
  //       finishedAt: trip.finishedAt,
  //       finalFare: trip.finalFare,
  //     });

  //   return handleSrvCliResponse(res);
  // }

  // async cancelTrip(data: any) {
  //   const res = await this.mainSrvCli.callAction({
  //     provider: 'TRIPS',
  //     action: 'cancelByDriver',
  //     query: data,
  //   });

  //   const trip = res.data;

  //   this.socketGateway.server
  //     .to(`passenger_${trip.passengerId}`)
  //     .emit('trip:cancelled', {
  //       tripId: trip.id,
  //       cancelledBy: 'DRIVER',
  //     });

  //   return handleSrvCliResponse(res);
  // }
}
