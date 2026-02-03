import { ApiOperation } from '@nestjs/swagger';
import { DriverAuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';
import { DriverSignUpInputDto } from 'src/dtos/driver.dto';

@Controller('Auth')
export class DriverAuthController {
  constructor(private readonly DriverAuthService: DriverAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'sign up in app with phone number' })
  async signUp(body: DriverSignUpInputDto) {
    const signUpData = await this.DriverAuthService.signUp(body);
    return signUpData;
  }
}
