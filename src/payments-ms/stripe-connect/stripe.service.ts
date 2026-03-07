import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { envs } from 'src/config/envs';
import { STRIPE_CLIENT } from 'src/config/services';
import { OrganizationService } from 'src/organization-ms/organization/organization.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripeClient: Stripe,
    private readonly organizationService: OrganizationService,
  ) {}

async connectAccount(user: CurrentUserContext) {
  try {
    let { stripeAccountId, email, organizationId } = user;

    // 1️⃣ Crear cuenta Express si no existe
    if (!stripeAccountId) {
      const account = await this.stripeClient.accounts.create({
        type: 'express',
        country: 'FR', //TODO: recibir pais en la request
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },   
        },
      });

      stripeAccountId = account.id;

      await this.organizationService.update(
        organizationId,
        { stripeAccountId },
        organizationId,
      );
    }

    // 2️⃣ Recuperar cuenta para saber qué tipo de link generar
    const account = await this.stripeClient.accounts.retrieve(
      stripeAccountId,
    );

    const linkType: 'account_onboarding' | 'account_update' =
      account.details_submitted
        ? 'account_update'
        : 'account_onboarding';

    // 3️⃣ Crear link de onboarding o update
    const accountLink = await this.stripeClient.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${envs.frontUrl}/stripe/refresh`,
      return_url: `${envs.frontUrl}/stripe/success`,
      type: linkType,
    });

    return {
      onboardingUrl: accountLink.url,
      accountId: stripeAccountId,
      type: linkType,
    };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(
      'Unexpected error connecting Stripe account',
    );
  }
}
}
