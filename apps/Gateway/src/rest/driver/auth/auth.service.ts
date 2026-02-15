/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  DriverRequestOtpInputDto,
  DriverVerifyOtpInputDto,
} from 'src/dtos/driver/driver.dto';
import { handleSrvCliResponse } from 'src/response/httpExceeption.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async requestOtp(body: DriverRequestOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'requestOtp',
      query: body,
    });

    return handleSrvCliResponse(data);
  }

  async verifyOtp(body: DriverVerifyOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'verifyOtp',
      query: body,
    });

    return handleSrvCliResponse(data);
  }

  async authorize(token: string) {
    const data = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'authorize',
      query: { token },
    });
    return handleSrvCliResponse(data);
  }
}
