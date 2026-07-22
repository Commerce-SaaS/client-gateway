import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from 'src/orders-ms/orders/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Name of the customer placing the order',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({
    description:
      'Future date/time to schedule this order for (must land exactly on a valid slot — see GET /orders/available-slots). Omit for "now".',
    example: '2026-07-15T12:30:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledFor?: Date;

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
