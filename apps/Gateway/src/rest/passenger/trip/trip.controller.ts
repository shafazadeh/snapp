/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Request,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PassengerAuthGuard } from '../auth/auth.guard';

import { PassengerTripService } from './trip.service';
import { CreateTripInputDto } from 'src/dtos/passenger/trip.dto';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';

@ApiTags('Passenger:Trip')
@ApiBearerAuth('Authorization')
@Controller('/trips')
@UseGuards(PassengerAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class PassengerTripController {
  constructor(private readonly tripService: PassengerTripService) {}

  @Post()
  @ApiOperation({ summary: 'Create new trip' })
  async createTrip(@Body() body: CreateTripInputDto, @Request() req) {
    const res = this.tripService.createTrip({
      passengerId: req.passenger.id,
      ...body,
    });
    return res;
  }

  // @Post(':tripId/cancel')
  // @ApiOperation({ summary: 'Cancel trip by passenger' })
  // async cancelTrip(@Param('tripId') tripId: string, @Request() req) {
  //   return this.tripService.cancelTrip({
  //     tripId,
  //     passengerId: req.passenger.id,
  //   });
  // }
}
