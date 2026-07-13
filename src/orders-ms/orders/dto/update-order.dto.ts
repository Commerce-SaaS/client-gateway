import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { VoidReason } from 'src/common/enums/void-reason.enum';

export class UpdateOrderDto {
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
    example: 'Jane Doe',
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
    enum: OrderStatus,
    description: 'New order status (validated server-side for allowed transitions)',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    enum: VoidReason,
    description: 'Reason category for voiding the order',
  })
  @IsOptional()
  @IsEnum(VoidReason)
  voidReason?: VoidReason;

  @ApiPropertyOptional({
    description:
      'Free-text details explaining the void reason. Required when voidReason is OTHER.',
    example: 'Customer changed their mind after payment was processed.',
    maxLength: 500,
  })
  @ValidateIf((o) => o.voidReason === VoidReason.OTHER)
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  voidReasonDetails?: string;

  @ApiPropertyOptional({
    description:
      'Reschedule (Date), unschedule and revert to "for now" (null), or leave unchanged (omit).',
    example: '2026-07-15T13:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledFor?: Date | null;
}
