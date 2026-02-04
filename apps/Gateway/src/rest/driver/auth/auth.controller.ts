/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverAuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  DriverRequestOTPDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';
import type { Response } from 'express';

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
  async verifyOtp(
    @Body() body: DriverVerifyOtpInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verifyOtpData = await this.DriverAuthService.verifyOtp(body);
    const tokenData = verifyOtpData.accessToken;
    res.cookie(tokenData.name, tokenData.token, {
      maxAge: tokenData.ttl,
      httpOnly: true,
      secure: true,
      sameSite: true,
      path: '/',
    });
    delete verifyOtpData.accessToken;
    return verifyOtpData;
  }
}
