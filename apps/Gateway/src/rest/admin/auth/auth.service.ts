/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import {
  AdminSessionModel,
  AdminSignInInputDto,
  AdminSignInOutputDto,
  GetAdminProfileOutputDto,
} from 'src/dtos/admin/admin.dto';
import { AuthorizeOutputDto, StatusResponseDto } from 'src/dtos/public.dto';
import { handleSrvCliResponse } from 'src/response/httpExceeption.filter';
import { MainServiceClient } from 'src/services/main.service';

@Injectable()
export class AdminAuthService {
  private logger = new Logger('rest/admin/auth/service');
  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async authorize(token: string): Promise<AuthorizeOutputDto> {
    const data = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'authorize',
      query: { token },
    });
    return handleSrvCliResponse(data);
  }

  async signIn(signInData: AdminSignInInputDto): Promise<AdminSignInOutputDto> {
    const data = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signIn',
      query: signInData,
    });
    return handleSrvCliResponse(data);
  }

  async signOut(session: AdminSessionModel): Promise<StatusResponseDto> {
    const data = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signOut',
      query: { id: session.id },
    });
    return handleSrvCliResponse(data);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getProfile(req): Promise<GetAdminProfileOutputDto> {
    return {
      userType: req.acc_type,
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }
}
