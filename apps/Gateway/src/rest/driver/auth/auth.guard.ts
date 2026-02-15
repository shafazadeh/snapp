/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { DriverAuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'common/decorators/public.decorator';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  constructor(
    private readonly authService: DriverAuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: any = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    const authorized = await this.authService.authorize(token);

    if (!authorized?.isAuthorized) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    if (authorized.driver && authorized.isActive === false) {
      throw new ForbiddenException('driver_inactive');
    }

    request.driver = authorized.driver;
    request.session = authorized.session;
    request.acc_type = 'DRIVER';

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
