import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/common/enums/order-status.enum';

export class CreateOrderStatusHistoryDto {
  @ApiProperty({
    description: 'Order ID associated with the status change',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'New status assigned to the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
