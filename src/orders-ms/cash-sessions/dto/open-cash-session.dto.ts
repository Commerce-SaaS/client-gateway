import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class OpenCashSessionDto {
  @ApiProperty({
    description: 'Cash amount physically placed in the register at the start of the shift (integer, minor units)',
    example: 20000,
  })
  @IsInt()
  @Min(0)
  openingCash: number;
}
