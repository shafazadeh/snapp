/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  DriverRequestOTPDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver.dto';
import { handleServiceResponse } from 'src/response/httpExceeption.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}
  async requestOtp(body: DriverRequestOTPDto) {
    const data: any = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'requestOtp',
      query: body,
    });

    return handleServiceResponse(data);
  }

  async verifyOtp(body: DriverVerifyOtpInputDto) {
    const response = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'verifyOtp',
      query: body,
    });
    return handleServiceResponse(response);
  }
}
