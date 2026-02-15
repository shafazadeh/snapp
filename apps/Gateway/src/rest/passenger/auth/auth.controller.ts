import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { PassengerAuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  PassengerRequestOtpInputDto,
  PassengerVerifyOtpInputDto,
} from 'src/dtos/passenger/passenger.dto';
import { PassengerAuthGuard } from './auth.guard';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('Passenger:Auth')
@Controller('/auth')
@ApiBearerAuth('Authorization')
@UseGuards(PassengerAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class PassengerAuthController {
  constructor(private readonly passengerAuthService: PassengerAuthService) {}

  @Post('request-otp')
  @Public()
  @ApiOperation({ summary: 'Request otp by phone number (Passenger)' })
  async requestOtp(@Body() body: PassengerRequestOtpInputDto) {
    return this.passengerAuthService.requestOtp(body);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify otp sent to passenger phone number' })
  async verifyOtp(@Body() body: PassengerVerifyOtpInputDto) {
    return this.passengerAuthService.verifyOtp(body);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get passenger profile' })
  async getProfile(@Request() req) {
    return req.passenger;
  }
}
