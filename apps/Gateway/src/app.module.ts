import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [RestModule, ServiceModule, UtilsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
