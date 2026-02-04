import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

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

export class DriverVerifyOtpInputDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '+989121234567',
    description: 'driver phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید ' })
  phone: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  otp: string;
}
