import { Injectable } from '@nestjs/common';
import {
  PassengerRequestOtpInputDto,
  PassengerVerifyOtpInputDto,
} from 'src/dtos/passenger/passenger.dto';
import { handleSrvCliResponse } from 'src/response/httpExceeption.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class PassengerAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async requestOtp(body: PassengerRequestOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'requestOtp',
      query: body,
    });

    return handleSrvCliResponse(data);
  }

  async verifyOtp(body: PassengerVerifyOtpInputDto) {
    const data = await this.mainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'verifyOtp',
      query: body,
    });

    return handleSrvCliResponse(data);
  }

  async authorize(token: string) {
    const data = await this.mainSrvCli.callAction({
      provider: 'PASSENGERS',
      action: 'authorize',
      query: { token },
    });

    return handleSrvCliResponse(data);
  }
}
