import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { OrderType } from 'src/common/enums/order-type.enum';

export class CreatePosOrderDto {
  @ApiPropertyOptional({
    description: 'Existing customer to associate with this order',
    format: 'uuid',
    example: 'c1c2c3c4-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Customer name to display on the order ticket',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1 555 123 4567',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Delivery / customer address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiPropertyOptional({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Order type. Defaults to TAKEAWAY. Use DINE_IN together with tableId to open a table order.',
    enum: OrderType,
    example: OrderType.DINE_IN,
  })
  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @ApiPropertyOptional({
    description: 'Required when orderType is DINE_IN. Must be a FREE table belonging to the organization.',
    format: 'uuid',
    example: 'a1b2c3d4-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiPropertyOptional({
    description: 'Number of people at the table (DINE_IN orders only)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  partySize?: number;

  @ApiPropertyOptional({
    description:
      'Future date/time to schedule this order for (TAKEAWAY/DELIVERY only — not valid with DINE_IN). Must land exactly on a valid slot — see GET /orders/available-slots.',
    example: '2026-07-15T12:30:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledFor?: Date;
}
