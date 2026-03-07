import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORGANIZATION_SERVICE, PAYMENT_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { PAYMENT_PATTERNS } from './patterns/payment_patterns';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { ORGANIZATION_PATTERNS } from 'src/organization-ms/organization/patterns/organization_patterns';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly client: ClientProxy,
    @Inject(ORGANIZATION_SERVICE)
    private readonly organizationClient: ClientProxy,
  ) {}

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
    organizationId: string,
    user: CurrentUserContext,
  ) {
    const org = await firstValueFrom(
      this.organizationClient.send(
        ORGANIZATION_PATTERNS.FIND_ONE,
        organizationId,
      ),
    );

    if (!org?.stripeAccountId) {
      throw new BadRequestException(
        'Organization does not have a connected Stripe account',
      );
    }
    
    return firstValueFrom(
      this.client.send(PAYMENT_PATTERNS.CREATE_PAYMENT_SESSION, {
        ...dto,
        stripeAccountId: org.stripeAccountId,
        organizationId,
        userId: user.id,
      }),
    );
  }
}
