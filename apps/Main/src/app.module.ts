import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
import { DatabaseModule } from './databases/database.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [ServiceModule, DatabaseModule, UtilsModule],
})
export class AppModule {}
