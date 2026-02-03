import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriverService } from 'providers/driver.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [SelfActionService, DriverService],
})
export class ServiceModule {}
