import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTripInputDto {
  @ApiProperty({ example: 35.6892 })
  @IsNumber()
  @IsNotEmpty()
  originLat: number;

  @ApiProperty({ example: 51.389 })
  @IsNumber()
  @IsNotEmpty()
  originLng: number;

  @ApiProperty({ example: 35.732 })
  @IsNumber()
  @IsNotEmpty()
  destinationLat: number;

  @ApiProperty({ example: 51.422 })
  @IsNumber()
  @IsNotEmpty()
  destinationLng: number;
}
