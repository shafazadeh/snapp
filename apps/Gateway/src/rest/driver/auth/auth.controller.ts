/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DriverAuthGuard } from './auth.guard';
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
import { DriverAuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DriverRequestOtpInputDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('Driver:Auth')
@Controller('driver/auth')
@ApiBearerAuth('Authorization')
@UseGuards(DriverAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @Public()
  @ApiOperation({ summary: 'Request otp in app by phone number' })
  async requestOtp(@Body() body: DriverRequestOtpInputDto) {
    return await this.driverAuthService.requestOtp(body);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify otp sent to driver phone number' })
  async verifyOtp(@Body() body: DriverVerifyOtpInputDto) {
    return await this.driverAuthService.verifyOtp(body);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get driver profile' })
  // eslint-disable-next-line @typescript-eslint/require-await
  async getProfile(@Request() req) {
    return req.driver;
  }
}
