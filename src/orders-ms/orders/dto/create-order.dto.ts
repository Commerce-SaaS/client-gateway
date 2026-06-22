import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from 'src/orders-ms/orders/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Name of the customer placing the order',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'List of items included in the order',
    type: () => CreateOrderItemDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
