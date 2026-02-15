/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */

import { AdminAuthGuard } from './auth.guard';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/response/httpExceeption.filter';
import { ResponseInterceptor } from 'src/response/response.Interceptor';
import { AdminAuthService } from './auth.service';
import {
  AdminSignInInputDto,
  GetAdminProfileOutputDto,
} from 'src/dtos/admin/admin.dto';
import { Public } from 'common/decorators/public.decorator';
import type { RequestWithUserData } from 'src/dtos/public.dto';
import type { Response } from 'express';
@ApiTags('Admin: Auth')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth()
@Controller('auth')
@ApiBadRequestResponse({ description: 'Bad Request | Bad Inputs' })
@ApiUnauthorizedResponse({ description: 'Session is expired | Unauthorized' })
@ApiForbiddenResponse({
  description: 'Permission denied | No Access | Not Subscribed',
})
@ApiUnsupportedMediaTypeResponse({
  description: 'Content|Context format is not supported or invalid',
})
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'Signin to panel as admin by username and password',
  })
  @Public()
  async signIn(
    @Body() body: AdminSignInInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAdminProfileOutputDto> {
    const signInData = await this.authService.signIn(body);
    const tokenData = signInData.tokenData;
    res.cookie(tokenData.name, tokenData.token, {
      maxAge: tokenData.ttl,
      httpOnly: true,
    });
    delete signInData.tokenData;
    return signInData;
  }
  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile (guarded)' })
  async getProfile(
    @Req() req: RequestWithUserData,
  ): Promise<GetAdminProfileOutputDto> {
    return {
      userType: 'ADMIN',
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }

  @Post('signout')
  @ApiOperation({ summary: 'Logout admin' })
  async signOut(
    @Req() req: RequestWithUserData,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = req.acc_session;
    if (!session) throw new Error('No session found for logout');

    await this.authService.signOut(session);
    res.clearCookie('auth_admin', { path: '/' });

    return { success: true };
  }
}
