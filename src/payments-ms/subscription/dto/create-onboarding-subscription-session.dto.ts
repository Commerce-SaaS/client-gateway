import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '../../payment/enums/payment-provider.enum';

export class CreateOnboardingSubscriptionSessionDto {
  @ApiProperty({
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    description: 'Payment provider to be used',
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({
    description: 'Stripe recurring price id for onboarding subscription',
    example: 'price_12345',
  })
  @IsString()
  priceId: string;
}
