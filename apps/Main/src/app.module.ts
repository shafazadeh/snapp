import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';

@Module({
  imports: [ServiceModule],
})
export class AppModule {}
