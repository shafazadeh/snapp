/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpStatus,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';

import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private logger = new Logger('providers/admins');
  constructor(
    private readonly pg: PostgresService,
    private readonly utils: UtilsService,
    private readonly redis: RedisService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const checkRootUser = await this.pg.models.Admin.findOne({
      where: {
        isDefault: true,
      },
    });
    if (checkRootUser) {
      this.logger.verbose('Initializing', 'Root user already exists');
      return;
    }
    const defaultPassword = 'rootpanelpassword';
    const { salt, hash } =
      await this.utils.PasswordHandler.generate(defaultPassword);
    await this.pg.models.Admin.create({
      email: 'root@snapp.com',
      name: 'Root Admin',
      isDefault: true,
      isActive: true,
      password: hash,
      salt,
    });

    this.logger.verbose('Initializing', 'Root user has been created');
    return;
  }
  async signIn({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const email = query.email.toLowerCase();

    //get profile
    const profile = await this.pg.models.Admin.findOne({
      where: {
        email,
      },
      nest: true,
      raw: true,
    });
    if (!profile || !profile.salt || !profile.password || !profile.id) {
      throw new SrvError(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );
    }
    // check password
    const passwordCheck = await this.utils.PasswordHandler.validate(
      query.password,
      profile.salt,
      profile.password,
    );
    if (!passwordCheck)
      throw new SrvError(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );

    //create session
    const newSession = await this.pg.models.AdminSession.create({
      adminId: profile.id,
      refreshExpiresAt: +new Date(),
    });
    if (!newSession?.id)
      throw new SrvError(
        HttpStatus.BAD_REQUEST,
        'err_auth_seesion_can_not_create',
      );
    const accessToken = new this.utils.JwtHandler.AccessToken(
      profile.id,
      'ADMIN',
    );
    const tokenData = accessToken.generate(newSession.id);
    await newSession.update({
      refreshExpiresAt: tokenData!.payload.refreshExpiresAt,
    });
    await newSession.reload();
    const _profile = await this.pg.models.Admin.scope(
      'withoutPassword',
    ).findByPk(profile.id, {
      raw: true,
    });

    return {
      data: {
        profile: _profile,
        session: newSession,
        isActive: _profile!.isActive,
        tokenData,
      },
    };
  }
  async authorize({
    query: { token },
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    let isAuthorized = false;
    let clearCookie: string | null = 'snapp_auth_admin';

    let tokenData;
    let admin;
    let session;

    const decodedToken: any = this.utils.JwtHandler.decodeToken(token);
    if (decodedToken) {
      const adminId = decodedToken.aid;
      admin = await this.getAdminById(adminId);
      if (admin) {
        session = await this.getSessionById(decodedToken.sid);
        const now = Date.now();

        // Refresh token expired → destroy session
        if (+new Date(decodedToken.refreshExpiresAt) <= now) {
          await this.pg.models.AdminSession.destroy({
            where: { id: decodedToken.sid },
          });
          await this.redis.cacheCli.del(`adminSession_${decodedToken.sid}`);
        }

        // Access token expired → regenerate + extend session
        else if (+new Date(decodedToken.accessExpiresAt) <= now) {
          if (session) {
            const accessToken = new this.utils.JwtHandler.AccessToken(
              session.adminId,
              'ADMIN',
            );
            tokenData = accessToken.generate(session.id);

            session = await this.extendSession(
              session.id,
              tokenData.payload.refreshExpiresAt,
            );

            isAuthorized = true;
          }
        }

        // Access token still valid
        else {
          if (session) isAuthorized = true;
        }
      }
    }

    if (isAuthorized) clearCookie = null;

    return {
      data: {
        isAuthorized,
        tokenData,
        admin,
        session,
        clearCookie,
        isActive: admin?.isActive ?? null,
      },
    };
  }
  async signOut({ query }: ServiceClientContextDto) {
    const sessionId = query.id;
    if (!sessionId) {
      throw new SrvError(HttpStatus.BAD_REQUEST, 'Session id is required');
    }

    await this.pg.models.AdminSession.destroy({
      where: { id: sessionId },
    });

    await this.redis.cacheCli.del(`adminSession_${sessionId}`);

    return { success: true };
  }

  private async getAdminById(id: string) {
    let admin = null;
    let _admin: any = await this.redis.cacheCli.get(`admin_${id}`);
    if (!_admin) {
      _admin = await this.pg.models.Admin.findByPk(id);
      if (!_admin) return null;

      _admin = JSON.parse(JSON.stringify(_admin));
      await this.redis.cacheCli.set(
        `admin_${_admin.id}`,
        JSON.stringify(_admin),
        'EX',
        900,
      );
      admin = _admin;
    } else admin = JSON.parse(_admin);
    return admin;
  }

  private async getSessionById(id: string) {
    let session = null;
    let _session: any = await this.redis.cacheCli.get(`adminSession_${id}`);
    if (!_session) {
      _session = await this.pg.models.AdminSession.findByPk(id);
      if (!_session) return null;

      await this.redis.cacheCli.set(
        `adminSession_${_session.id}`,
        JSON.stringify(_session),
        'EX',
        900,
      );
      session = _session;
    } else session = JSON.parse(_session);
    return session;
  }

  private async extendSession(id: string, refreshExpiresAt: number) {
    const updated = await this.pg.models.AdminSession.update(
      { refreshExpiresAt },
      { where: { id }, returning: true },
    );
    const session = updated[0] ? updated[1][0] : null;
    if (session)
      await this.redis.cacheCli.set(
        `adminSession_${session.id}`,
        JSON.stringify(session),
        'EX',
        900,
      );
    return session;
  }
}
