import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { PAYMENT_SERVICE } from 'src/config/services';

const STRIPE_CONNECT_PATTERNS = {
  CONNECT_ACCOUNT: 'stripe.connect.account',
} as const;

@Injectable()
export class StripeService {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly client: ClientProxy,
  ) {}

  connectAccount(user: CurrentUserContext) {
    return rpcSend(this.client, STRIPE_CONNECT_PATTERNS.CONNECT_ACCOUNT, {
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
      stripeAccountId: user.stripeAccountId,
    });
  }
}
