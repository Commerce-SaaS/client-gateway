import { Global, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from 'src/config/services';
import { OrganizationModule } from 'src/organization-ms/organization/organization.module';

@Global()
@Module({
  controllers: [StripeController],
  imports: [OrganizationModule],
  providers: [
    StripeService,
    {
      provide: STRIPE_CLIENT,
      useFactory: () => {
        return new Stripe(envs.stripeSecret, {
          apiVersion: '2026-01-28.clover',
        });
      },
    },
  ],
  exports: [STRIPE_CLIENT],
})
export class StripeModule {}
