import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from 'src/config/services';

@Module({
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    {
      provide: STRIPE_CLIENT,
      useFactory: () =>
        new Stripe(envs.stripeSecret, {
          apiVersion: '2026-01-28.clover',
        }),
    },
  ],
})
export class WebhooksModule {}
