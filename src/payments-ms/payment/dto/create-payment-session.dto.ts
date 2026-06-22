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
  @ApiProperty({ description: 'Product display name', example: 'Pizza Margherita' })
  @IsString()
  name!: string;
}

export class PriceData {
  @ApiProperty({ description: 'Three-letter ISO currency code', example: 'usd' })
  @IsString()
  currency!: string;

  @ApiProperty({ description: 'Product metadata for the line item', type: () => ProductData })
  @ValidateNested()
  @Type(() => ProductData)
  product_data!: ProductData;

  @ApiProperty({ description: 'Unit amount in smallest currency unit (e.g. cents)', example: 1250 })
  @IsNumber()
  unit_amount!: number;
}

export class LineItem {
  @ApiProperty({ description: 'Pricing data for the line item', type: () => PriceData })
  @ValidateNested()
  @Type(() => PriceData)
  price_data!: PriceData;

  @ApiProperty({ description: 'Quantity of this line item', example: 2 })
  @IsNumber()
  quantity!: number;
}

export class CreatePaymentSessionDto {
  @ApiProperty({
    example: 'c2f6f8b3-1234-4567-8910-abcdef123456',
    description: 'Order identifier',
  })
  @IsString()
  orderId!: string;

  @ApiProperty({
    example: 2500,
    description:
      'Amount of the order in the smallest currency unit (e.g., cents)',
  })
  @IsNumber()
  amount!: number;

  @ApiProperty({
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    description: 'Payment provider to be used',
  })
  @IsEnum(PaymentProvider)
  provider!: PaymentProvider;

  @ApiProperty({
    isArray: true,
    description: 'List of items included in the payment session',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineItem)
  lineItems!: LineItem[];
}
