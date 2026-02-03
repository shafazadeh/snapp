import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver.module';

// استفاده از روتر ماژول برای مشخص کردن روت های کلی سرویس های ما

@Module({
  imports: [
    AdminModule,
    DriverModule,
    PassengerModule,
    RouterModule.register([
      // برای prefix ها
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'passenger',
        module: PassengerModule,
      },
      {
        path: 'driver',
        module: DriverModule,
      },
    ]),
  ],
})
export class RestModule {}
