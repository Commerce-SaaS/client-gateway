import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '../../payment/enums/payment-provider.enum';

export class CreateSubscriptionSessionDto {
  @ApiProperty({
    description: 'UUID of the subscription',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  subscriptionId: string;

  @ApiProperty({
    description: 'ID of the pricing plan associated with the subscription',
    example: 'price_12345',
  })
  @IsString()
  priceId: string;

  @ApiProperty({
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    description: 'Payment provider to be used',
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
