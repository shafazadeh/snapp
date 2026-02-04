import { TokenService } from './../src/utils/handlers/token.servie';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgressService } from 'src/databases/postgress/postgress.service';
import { RedisService } from 'src/databases/redis/rediis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  constructor(
    private readonly ps: PostgressService,
    private readonly redis: RedisService,
    private readonly tokenService: TokenService,
  ) {}

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

  async verifyOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone, otp } = query;

    const key = `otp:${DriverService.role}:${phone}`;
    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp)
      throw new SrvError(HttpStatus.BAD_REQUEST, 'otp not found or expired');

    if (savedOtp !== otp)
      throw new SrvError(HttpStatus.BAD_REQUEST, 'invalid otp');

    await this.redis.cacheCli.del(key);

    let driver = await this.ps.models.Driver.findOne({ where: { phone } });
    if (!driver) driver = await this.ps.models.Driver.create({ phone });

    const newSession = await this.ps.models.DriverSeesion.create({
      driverId: driver.id,
      refreshExpireAt: +new Date(),
    });

    const accessToken = this.tokenService.generateAccessToken({
      driverId: driver.id,
      sessionId: newSession.id,
    });

    await newSession.update({
      refreshExpireAt: accessToken.payload.refreshExpireAt,
    });
    await newSession.reload();

    return {
      message: 'otp is vail',
      data: {
        success: true,
        phone,
        accessToken,
      },
    };
  }
}
