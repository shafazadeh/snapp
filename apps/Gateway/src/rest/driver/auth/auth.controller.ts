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
import { DriverRequestOTPDto } from 'src/dtos/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';

@Controller('Auth')
export class DriverAuthController {
  constructor(private readonly DriverAuthService: DriverAuthService) {}

  @ApiTags('Driver:Auth')
  @Post('request-otp')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ summary: 'request otp with phone number' })
  async signUp(@Body() body: DriverRequestOTPDto) {
    const requestOtpData = await this.DriverAuthService.requestOtp(body);
    return requestOtpData;
  }
}
