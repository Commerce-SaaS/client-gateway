import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { VoidReason } from 'src/common/enums/void-reason.enum';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Customer name to display on the order ticket',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

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
}
