import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { PassengerAuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'common/decorators/public.decorator';

@Injectable()
export class PassengerAuthGuard implements CanActivate {
  constructor(
    private readonly authService: PassengerAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: any = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    const authorized = await this.authService.authorize(token);

    if (!authorized?.isAuthorized) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    if (authorized.passenger && authorized.isActive === false) {
      throw new ForbiddenException('passenger_inactive');
    }

    request.passenger = authorized.passenger;
    request.session = authorized.session;
    request.acc_type = 'PASSENGER';

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
