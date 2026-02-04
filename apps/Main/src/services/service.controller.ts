/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, HttpStatus } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { SelfActionService } from './actions.service';

@Controller()
export class ServiceController {
  constructor(
    private readonly actions: SelfActionService,
    // private readonly event: SelfEventService,
  ) {}

  @MessagePattern('callAction')
  async callTestMessage(data) {
    try {
      const res: any = await this.actions.findAndCall(data);
      return {
        context: data,
        status: 'SUCCEED',
        code: 200,
        message: res?.message || 'ok',
        error: null,
        data: res?.data || null,
      };
    } catch (error) {
      return {
        context: data,
        status: 'FAIlED',
        code: error?.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'err_service_nothandeled',
        error: null,
        data: null,
      };
    }
  }

  @EventPattern('callEvent')
  async callTestEvent(data: any) {}
}
