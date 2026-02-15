import { HttpStatus, Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';
import { PostgresService } from 'src/databases/postgres/postgres.service';

@Injectable()
export class PassengersService {
  private static readonly role = 'passenger';
  private readonly OTP_TTL_SECONDS = 120;

  constructor(
    private readonly pg: PostgresService,
    private readonly redis: RedisService,
    private readonly utils: UtilsService,
  ) {}

  /* =======================
     Request OTP
  ======================= */
  async requestOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone } = query;

    if (!phone || typeof phone !== 'string') {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid phone');
    }

    const otpKey = `otp:${PassengersService.role}:${phone}`;
    PassengersService;
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

  /* =======================
     Verify OTP
  ======================= */
  async verifyOtp({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const { phone, otp } = query;
    const key = `otp:${PassengersService.role}:${phone}`;

    const savedOtp = await this.redis.cacheCli.get(key);
    if (!savedOtp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'OTP not found or expired');
    }

    if (savedOtp !== otp) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    await this.redis.cacheCli.del(key);

    let profile = await this.pg.models.Passenger.findOne({
      where: { phone },
    });

    if (!profile) {
      profile = await this.pg.models.Passenger.create({ phone });
    }

    await this.pg.models.PassengerSession.destroy({
      where: { passengerId: profile.id },
    });

    const newSession = await this.pg.models.PassengerSession.create({
      passengerId: profile.id,
      refreshExpiresAt: +new Date(),
    });

    const accessToken = new this.utils.JwtHandler.AccessToken(
      profile.id,
      'PASSENGER',
    );

    const tokenData = accessToken.generate(newSession.id);

    await newSession.update({
      refreshExpiresAt: tokenData!.payload.refreshExpiresAt,
    });

    await newSession.reload();

    await this.redis.cacheCli.set(
      `passenger_${profile.id}`,
      JSON.stringify(JSON.parse(JSON.stringify(profile))),
      'EX',
      900,
    );

    await this.redis.cacheCli.set(
      `passengerSession_${newSession.id}`,
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

  /* =======================
     Authorize
  ======================= */
  async authorize({
    query: { token },
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    let isAuthorized = false;
    let tokenData;
    let passenger;
    let session;

    const decodedToken: any = this.utils.JwtHandler.decodeToken(token);

    if (decodedToken) {
      const passengerId = decodedToken.aid;

      passenger = await this.getPassengerById(passengerId);

      if (passenger) {
        session = await this.getSessionById(decodedToken.sid);
        const now = Date.now();

        if (+new Date(decodedToken.refreshExpiresAt) <= now) {
          if (session) {
            await this.pg.models.PassengerSession.destroy({
              where: { id: decodedToken.sid },
            });
            await this.redis.cacheCli.del(
              `passengerSession_${decodedToken.sid}`,
            );
          }
        } else if (+new Date(decodedToken.accessExpiresAt) <= now) {
          if (session) {
            const accessToken = new this.utils.JwtHandler.AccessToken(
              passenger.id,
              'PASSENGER',
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
        passenger,
        session,
        isActive: passenger?.isActive ?? null,
      },
    };
  }

  /* =======================
     Helpers
  ======================= */

  private async getPassengerById(id: string) {
    let passenger = null;
    let _passenger: any = await this.redis.cacheCli.get(`passenger_${id}`);

    if (!_passenger) {
      _passenger = await this.pg.models.Passenger.findByPk(id);
      if (!_passenger) return null;

      _passenger = JSON.parse(JSON.stringify(_passenger));

      await this.redis.cacheCli.set(
        `passenger_${_passenger.id}`,
        JSON.stringify(_passenger),
        'EX',
        900,
      );

      passenger = _passenger;
    } else passenger = JSON.parse(_passenger);

    return passenger;
  }

  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`passengerSession_${id}`);

    if (!_session) {
      _session = await this.pg.models.PassengerSession.findByPk(id);
      if (!_session) return null;

      await this.redis.cacheCli.set(
        `passengerSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );

      session = _session;
    } else session = JSON.parse(_session);

    return session;
  }

  private async extendSession(id: string, refreshExpiresAt: number) {
    const updated = await this.pg.models.PassengerSession.update(
      { refreshExpiresAt },
      { where: { id }, returning: true },
    );

    const session = updated[0] ? updated[1][0] : null;

    if (session)
      await this.redis.cacheCli.set(
        `passengerSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );

    return session;
  }
}
