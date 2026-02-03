import { ApiOperation } from '@nestjs/swagger';
import { DriverAuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { DriverRequestOTPDto } from 'src/dtos/driver.dto';

@Controller('Auth')
export class DriverAuthController {
  constructor(private readonly DriverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'request otp with phone number' })
  async signUp(@Body() body: DriverRequestOTPDto) {
    const requestOtpData = await this.DriverAuthService.requestOtp(body);
    return requestOtpData;
  }
}
