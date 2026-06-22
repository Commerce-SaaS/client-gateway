import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  UYU = 'uyu',
  MXN = 'mxn',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Order ID',
    example: '01d2acaa-5a3b-404a-9471-41b060895b18',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Amount of the payment',
    example: 49.99,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency of the payment',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Payment Method id',
    example: '01d2acaa-5a3b-404a-9471-41b060895b18',
  })
  @IsString()
  paymentMethodId: string;

  @ApiProperty({
    description: 'Payment Method name',
    example: 'cash',
  })
  @IsString()
  paymentMethodName: string;
}
