import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Payment Method id to reassign this payment to',
    example: '01d2acaa-5a3b-404a-9471-41b060895b18',
  })
  @IsUUID()
  paymentMethodId: string;
}
