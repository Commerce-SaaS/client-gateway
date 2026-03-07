import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { Type } from 'class-transformer';

export class ProductData {
  @IsString()
  name: string;
}

export class PriceData {
  @IsString()
  currency: string;

  @ValidateNested()
  @Type(() => ProductData)
  product_data: ProductData;

  @IsNumber()
  unit_amount: number;
}

export class LineItem {
  @ValidateNested()
  @Type(() => PriceData)
  price_data: PriceData;

  @IsNumber()
  quantity: number;
}

export class CreatePaymentSessionDto {
  @ApiProperty({
    example: 'c2f6f8b3-1234-4567-8910-abcdef123456',
    description: 'Order identifier',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    example: 2500,
    description:
      'Amount of the order in the smallest currency unit (e.g., cents)',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    description: 'Payment provider to be used',
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({
    isArray: true,
    description: 'List of items included in the payment session',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineItem)
  lineItems: LineItem[];
}
