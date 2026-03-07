import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SUBSCRIPTION_PATTERNS } from './patterns/suscription_patterns';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/config/services';
import { CreateSubscriptionSessionDto } from './dto/create-subscription-session.dto';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';

@Injectable()
export class SubscriptionService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientProxy) {}

  createSubscriptionSession(
    dto: CreateSubscriptionSessionDto,
    organizationId: string,
    user: CurrentUserContext,
  ) {
    return firstValueFrom(
      this.client.send(SUBSCRIPTION_PATTERNS.CREATE_SUBSCRIPTION_SESSION, {
        ...dto,
        organizationId,
        userId: user.id,
      }),
    );
  }
}
