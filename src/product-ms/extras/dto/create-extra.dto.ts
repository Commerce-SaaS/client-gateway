import { IsUUID, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExtraDto {
  @ApiProperty({
    description: 'Name of the extra',
    example: 'Extra Cheese',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Price of the extra in the default currency',
    example: 2.5,
  })
  @IsNumber()
  price: number;
}
