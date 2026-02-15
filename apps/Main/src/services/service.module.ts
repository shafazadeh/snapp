import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SelfActionService } from './actions.service';
import { DriverService } from 'providers/driver.service';
import { AdminService } from 'providers/admin.service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [SelfActionService, DriverService, AdminService],
})
export class ServiceModule {}
