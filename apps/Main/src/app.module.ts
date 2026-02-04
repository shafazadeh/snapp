import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configurations';
import { DatabaseModule } from './databases/database.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ServiceModule,
    DatabaseModule,
    UtilsModule,
  ],
})
export class AppModule {}
