import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

/* =======================
   Passenger Model
======================= */
export class PassengerModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, example: '+989121234567' })
  phone: string;

  @ApiProperty({ type: String, required: false })
  email?: string;

  @ApiProperty({ type: String, required: false })
  firstName?: string;

  @ApiProperty({ type: String, required: false })
  lastName?: string;

  @ApiProperty({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty({ type: Boolean, default: false })
  isVerified: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

/* =======================
   Passenger Session Model
======================= */
export class PassengerSessionModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  passengerId: string;

  @ApiProperty({ type: Date })
  refreshExpiresAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

/* =======================
   Auth DTOs
======================= */

export class PassengerRequestOtpInputDto {
  @ApiProperty({
    example: '+989121234567',
    description: 'Passenger phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید.' })
  phone: string;
}

export class PassengerVerifyOtpInputDto {
  @ApiProperty({
    example: '+989121234567',
    description: 'Passenger phone number',
  })
  @IsPhoneNumber('IR', { message: 'شماره تلفن معتبر وارد کنید.' })
  phone: string;

  @ApiProperty({
    example: '1234',
    description: 'OTP code',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  otp: string;
}
