/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  driverId: string;
  sessionId: string;
  accessExpireAt: number;
  refreshExpireAt: number;
}

export interface AccessTokenResualt {
  name: string;
  ttl: number;
  token: string;
  payload: AccessTokenPayload;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(params: {
    driverId: string;
    sessionId: string;
  }): AccessTokenResualt {
    const now = Date.now();

    const accessExpireInSec =
      this.config.get('Jwt.access.expireSecounds') ?? 3600;
    const refreshExpireInSec =
      this.config.get('Jwt.refresh.expireSecounds') ?? 3600;

    const accessExpireAt = now + accessExpireInSec * 1000;
    const refreshExpireAt = now + refreshExpireInSec * 1000;

    const ttl = refreshExpireInSec * 1000;

    const payload = {
      did: params.driverId,
      sid: params.sessionId,
      aea: accessExpireAt,
      rea: accessExpireAt,
    };

    const token = this.jwt.sign(payload, {
      secret: this.config.get('Jwt.access.secret'),
      expiresIn: accessExpireInSec,
    });

    return {
      name: 'auth_driver',
      ttl,
      token,
      payload: {
        driverId: params.driverId,
        sessionId: params.sessionId,
        accessExpireAt,
        refreshExpireAt,
      },
    };
  }

  // decode(token: string) {}

  // checkExpiry(token: string) {}

  // verifyAccessToken(token: string): AccessTokenPayload {}

  // verifyRefreshToken(token: string) {}
}
