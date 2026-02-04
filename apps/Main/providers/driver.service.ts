/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/databases/redis/rediis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  constructor(private readonly redis: RedisService) {}

  async requestOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone } = query;
    // otp ها رو میخوام توی
    // redis نگهداری کنم
    const key = `otp:${DriverService.role}:${phone}`;
    const existing = await this.redis.cacheCli.get(key);
    if (existing)
      throw new SrvError(HttpStatus.BAD_REQUEST, 'otp already send');
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 2 * 60;
    await this.redis.cacheCli.set(key, otp, 'EX', ttl);
    return {
      message: 'otp send successfully',
      data: { success: true, otp, phone, expiresIn: ttl },
    };
  }
}
