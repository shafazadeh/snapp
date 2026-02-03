/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MainServiceClient {
  //Main
  // از اسم معرفی شده در ماژول اومده
  constructor(@Inject('Main') private readonly cli: ClientProxy) {}

  // یه پیامی رو میفرسته و منتظر جوابش نمیمونه
  async callEvent(data: any) {
    try {
      // خروجی emit
      // یک observable
      // برای تبدیلش به پرامیس از
      //lastValueFrom
      // استفاده میکنیم
      const res: any = await lastValueFrom(this.cli.emit('callEvent', data));
      // درسته این متد منتظر پاسخ نمیمونه
      // این برای یکسان شدنه خروجی سروره
      return res;
    } catch (error) {
      return {
        context: data,
        status: 'failed',
        code: HttpStatus.SERVICE_UNAVAILABLE,
        message: null,
        error: null,
        data: error,
      };
    }
  }

  // پیام رو میفرسته و منتظر جوابش میمونه
  async callAction(data: any) {
    try {
      const res: any = await lastValueFrom(this.cli.send('callAction', data));
      return res;
    } catch (error) {
      return {
        context: data,
        status: 'failed',
        code: HttpStatus.SERVICE_UNAVAILABLE,
        message: null,
        error: null,
        data: error,
      };
    }
  }
}
