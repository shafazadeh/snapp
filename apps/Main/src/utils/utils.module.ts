import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './handlers/token.servie';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class UtilsModule {}
