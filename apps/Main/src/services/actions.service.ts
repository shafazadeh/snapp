/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { DriverService } from 'providers/driver.service';
import { ServiceClientActionInputDto, ServiceResponseData } from './dto';
import _ from 'lodash';
import { AdminService } from 'providers/admin.service';
@Injectable()
export class SelfActionService {
  constructor(
    private readonly driverService: DriverService,
    private readonly adminService: AdminService,
  ) {}

  async findAndCall(
    data: ServiceClientActionInputDto,
  ): Promise<ServiceResponseData> {
    const providerName = data?.provider || null;
    const actionName = data?.action || null;

    if (!providerName || !actionName)
      throw new Error('err_service_noActionProvider');

    let provider: any;
    switch (providerName) {
      case 'DRIVERS':
        provider = this.driverService;
        break;
      case 'ADMINS':
        provider = this.adminService;
        break;

      default:
        provider = null;
        break;
    }

    if (!provider || !provider[actionName])
      throw new Error('err_service_noActionFound');

    const response = await provider[actionName](
      _.pick(data, ['query', 'set', 'options']),
    );
    return {
      message: response?.message ?? 'ok',
      data: response?.data ?? response,
    };
  }
}
