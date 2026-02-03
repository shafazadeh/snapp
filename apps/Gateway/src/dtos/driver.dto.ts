import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class DriverRequestOTPDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '+989121234567',
    description: 'driver phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید ' })
  phone: string;
}
