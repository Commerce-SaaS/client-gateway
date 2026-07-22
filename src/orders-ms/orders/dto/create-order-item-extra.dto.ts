import {
  IsUUID,
  IsNumber,
  Min,
  IsInt,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemExtraDto {
  @ApiProperty({
    description: 'Extra ID from catalog',
    example: '0146bdf6-ab6f-43e0-b28b-8891709f2c56',
  })
  @IsUUID()
  extraId: string;

  @ApiProperty({
    description: 'Name of the extra',
    example: 'Cheese',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Price of the extra in the default currency',
    example: 12.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantity of the extra',
    example: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
