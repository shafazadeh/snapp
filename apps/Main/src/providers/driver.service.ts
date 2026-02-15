/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class DriverService {
  private static readonly role = 'driver';
  private readonly OTP_TTL_SECONDS = 120;

  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService,
    private readonly utils: UtilsService,
  ) {}

  async requestOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone } = query;

    if (!phone || typeof phone !== 'string') {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid phone');
    }

    const otpKey = `otp:${DriverService.role}:${phone}`;

    const existing = await this.redis.cacheCli.get(otpKey);
    if (existing) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'OTP already sent');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await this.redis.cacheCli.set(otpKey, otp, 'EX', this.OTP_TTL_SECONDS);

    return {
      message: 'OTP send successfully!',
      data: {
        success: true,
        phone,
        expiresIn: this.OTP_TTL_SECONDS,
        otp,
      },
    };
  }

  async verifyOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone, otp } = query;
    const key = `otp:${DriverService.role}:${phone}`;

    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'OTP not found or expired');
    }

    if (savedOtp !== otp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    await this.redis.cacheCli.del(key);

    let profile = await this.pg.models.Driver.findOne({ where: { phone } });
    if (!profile) {
      profile = await this.pg.models.Driver.create({ phone });
    }

    await this.pg.models.DriverSession.destroy({
      where: { driverId: profile.id },
    });

    const newSession = await this.pg.models.DriverSession.create({
      driverId: profile.id,
      refreshExpiresAt: +new Date(),
    });

    const accessToken = new this.utils.JwtHandler.AccessToken(
      profile.id,
      'DRIVER',
    );
    const tokenData = accessToken.generate(newSession.id);

    await newSession.update({
      refreshExpiresAt: tokenData!.payload.refreshExpiresAt,
    });
    await newSession.reload();

    await this.redis.cacheCli.set(
      `driver_${profile.id}`,
      JSON.stringify(JSON.parse(JSON.stringify(profile))),
      'EX',
      900,
    );
    await this.redis.cacheCli.set(
      `driverSession_${newSession.id}`,
      JSON.stringify(newSession),
      'EX',
      900,
    );

    return {
      message: 'OTP verified successfully!',
      data: {
        success: true,
        phone,
        tokenData,
      },
    };
  }

  async authorize({
    query: { token },
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    let isAuthorized = false;
    let tokenData;
    let driver;
    let session;

    const decodedToken: any = this.utils.JwtHandler.decodeToken(token);
    if (decodedToken) {
      const driverId = decodedToken.aid;
      driver = await this.getDriverById(driverId);
      if (driver) {
        session = await this.getSessionById(decodedToken.sid);
        const now = Date.now();

        if (+new Date(decodedToken.refreshExpiresAt) <= now) {
          if (session) {
            await this.pg.models.DriverSession.destroy({
              where: { id: decodedToken.sid },
            });
            await this.redis.cacheCli.del(`driverSession_${decodedToken.sid}`);
          }
        } else if (+new Date(decodedToken.accessExpiresAt) <= now) {
          if (session) {
            const accessToken = new this.utils.JwtHandler.AccessToken(
              driver.id,
              'DRIVER',
            );
            tokenData = accessToken.generate(session.id);

            session = await this.extendSession(
              session.id,
              tokenData.payload.refreshExpiresAt,
            );
            isAuthorized = true;
          }
        } else {
          if (session) isAuthorized = true;
        }
      }
    }

    return {
      data: {
        isAuthorized,
        tokenData,
        driver,
        session,
        isActive: driver?.isActive ?? null,
      },
    };
  }

  private async getDriverById(id: string) {
    let driver = null;
    let _driver: any = await this.redis.cacheCli.get(`driver_${id}`);
    if (!_driver) {
      _driver = await this.pg.models.Driver.findByPk(id);
      if (!_driver) return null;
      _driver = JSON.parse(JSON.stringify(_driver));
      await this.redis.cacheCli.set(
        `driver_${_driver.id}`,
        JSON.stringify(_driver),
        'EX',
        900,
      );
      driver = _driver;
    } else driver = JSON.parse(_driver);
    return driver;
  }

  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`driverSession_${id}`);
    if (!_session) {
      _session = await this.pg.models.DriverSession.findByPk(id);
      if (!_session) return null;
      await this.redis.cacheCli.set(
        `driverSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );
      session = _session;
    } else session = JSON.parse(_session);
    return session;
  }

  private async extendSession(id: string, refreshExpiresAt: number) {
    const updated = await this.pg.models.DriverSession.update(
      { refreshExpiresAt },
      { where: { id }, returning: true },
    );
    const session = updated[0] ? updated[1][0] : null;
    if (session)
      await this.redis.cacheCli.set(
        `driverSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );
    return session;
  }
}
