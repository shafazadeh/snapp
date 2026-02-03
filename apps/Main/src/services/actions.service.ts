/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DriverService } from 'providers/driver.service';

@Injectable()
export class SelfActionService {
  constructor(private readonly driverService: DriverService) {}

  async findAndCall(data: any) {
    const providerName = data?.provider || null;
    const actionName = data?.action || null;

    if (!providerName || !actionName)
      throw new Error('err_service_noActionProvider');

    let provider: any;
    switch (providerName) {
      case 'DRIVERS':
        provider = this.driverService;
        break;

      default:
        provider = null;
        break;
    }

    if (!provider || !provider[actionName])
      throw new Error('err_service_noActionFound');
    console.log(provider, actionName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const response = await provider[actionName]();
    return {
      message: response?.message ?? 'ok',
      data: response?.data ?? response,
    };
  }
}
