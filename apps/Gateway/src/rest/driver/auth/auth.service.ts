import { Injectable } from '@nestjs/common';
import { DriverSignUpInputDto } from 'src/dtos/driver.dto';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class DriverAuthService {
  constructor(private readonly mainSrvCli: MainServiceClient) {}
  async signUp(body: DriverSignUpInputDto) {
    const data: any = await this.mainSrvCli.callAction({
      provider: 'DRIVERS',
      action: 'signUp',
      query: body,
    });

    return data;
  }
}
