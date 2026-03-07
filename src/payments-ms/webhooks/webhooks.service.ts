import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WEB_HOOK_PATTERNS } from './patterns/webhook_patterns';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_EVENTS_CLIENT, STRIPE_CLIENT } from 'src/config/services';
import { Request, Response } from 'express';
import { PaymentProvider } from './enums/payment-provider.enum';
import { envs } from 'src/config';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  constructor(
    @Inject(PAYMENTS_EVENTS_CLIENT) private readonly client: ClientProxy,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  handleStripeWebhook(req: Request, res: Response, secret: string) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        secret,
      );

      this.client.emit(WEB_HOOK_PATTERNS.WEB_HOOK, {
        provider: PaymentProvider.STRIPE,
        event,
      });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    return res.status(200).json({ received: true });
  }

  detectProvider(req: Request): PaymentProvider {
    if (req.headers['stripe-signature']) {
      return PaymentProvider.STRIPE;
    }
    throw new BadRequestException('Unsupported payment provider');
  }
}
