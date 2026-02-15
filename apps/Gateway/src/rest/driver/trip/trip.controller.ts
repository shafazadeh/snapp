/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Param,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverAuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';
import { DriverTripService } from './trip.service';

@ApiTags('Driver:Trip')
@ApiBearerAuth('Authorization')
@Controller('driver/trips')
@UseGuards(DriverAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverTripController {
  constructor(private readonly tripService: DriverTripService) {}

  @Post(':tripId/accept')
  @ApiOperation({ summary: 'Accept a trip' })
  async acceptTrip(@Param('tripId') tripId: string, @Request() req) {
    return this.tripService.acceptTrip({
      tripId,
      driverId: req.driver.id,
    });
  }

  @Post(':tripId/arrived')
  @ApiOperation({ summary: 'Driver arrived at origin' })
  async arrivedTrip(@Param('tripId') tripId: string, @Request() req) {
    return this.tripService.arrivedTrip({
      tripId,
      driverId: req.driver.id,
    });
  }

  // @Post(':tripId/start')
  // @ApiOperation({ summary: 'Start trip (passenger picked up)' })
  // async startTrip(@Param('tripId') tripId: string, @Request() req) {
  //   return this.tripService.startTrip({
  //     tripId,
  //     driverId: req.driver.id,
  //   });
  // }

  // @Post(':tripId/end')
  // @ApiOperation({ summary: 'End trip' })
  // async endTrip(@Param('tripId') tripId: string, @Request() req) {
  //   return this.tripService.endTrip({
  //     tripId,
  //     driverId: req.driver.id,
  //   });
  // }

  // @Post(':tripId/cancel')
  // @ApiOperation({ summary: 'Cancel trip by driver' })
  // async cancelTrip(@Param('tripId') tripId: string, @Request() req) {
  //   return this.tripService.cancelTrip({
  //     tripId,
  //     driverId: req.driver.id,
  //   });
  // }
}
