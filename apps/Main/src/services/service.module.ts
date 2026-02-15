import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriverService } from 'src/providers/driver.service';
import { AdminService } from 'src/providers/admin.service';
import { PassengersService } from 'src/providers/passenger.service';
import { TripService } from 'src/providers/trip.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [
    SelfActionService,
    DriverService,
    AdminService,
    PassengersService,
    TripService,
  ],
})
export class ServiceModule {}
