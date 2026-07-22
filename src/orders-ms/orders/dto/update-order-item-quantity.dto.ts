import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateOrderItemQuantityDto {
  @ApiProperty({ description: 'New quantity for this item (minimum 1)', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}
