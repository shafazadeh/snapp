/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverAuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  DriverRequestOTPDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';

@ApiTags('Driver:Auth')
@Controller('Auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverAuthController {
  constructor(private readonly DriverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'request otp with phone number' })
  async signUp(@Body() body: DriverRequestOTPDto) {
    const requestOtpData = await this.DriverAuthService.requestOtp(body);
    return requestOtpData;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'verify otp send to driver phone number' })
  async verifyOtp(@Body() body: DriverVerifyOtpInputDto) {
    const requestOtpData = await this.DriverAuthService.verifyOtp(body);
    return requestOtpData;
  }
}
