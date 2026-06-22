import { Inject, Injectable } from '@nestjs/common';
import { SUBSCRIPTION_PATTERNS } from './patterns/suscription_patterns';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/config/services';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { CreateOnboardingSubscriptionSessionDto } from './dto/create-onboarding-subscription-session.dto';
import { SubscriptionPlan } from './enums/subscription-plan.enum';
import { SubscriptionErrorCode } from './enums/subscription-error-code.enum';

@Injectable()
export class SubscriptionService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientProxy) {}

  createOnboardingSubscriptionSession(
    dto: CreateOnboardingSubscriptionSessionDto,
    userId: string,
  ) {
    return rpcSend(
      this.client,
      SUBSCRIPTION_PATTERNS.CREATE_ONBOARDING_SUBSCRIPTION_SESSION,
      {
        ...dto,
        userId,
      },
    );
  }

  getPlans() {
    return rpcSend(this.client, SUBSCRIPTION_PATTERNS.GET_PLANS, {});
  }

  async getMySubscription(userId: string) {
    try {
      return await rpcSend(this.client, SUBSCRIPTION_PATTERNS.GET_BY_USER, {
        userId,
      });
    } catch (error: any) {
      const code = error?.code ?? error?.error?.code ?? error?.response?.code;
      if (code === SubscriptionErrorCode.SUBSCRIPTION_NOT_FOUND) {
        return null;
      }
      throw error;
    }
  }

  getMySubscriptionHistory(userId: string) {
    return rpcSend(this.client, SUBSCRIPTION_PATTERNS.GET_MY_HISTORY, {
      userId,
    });
  }

  changePlan(id: string, userId: string, plan: SubscriptionPlan) {
    return rpcSend(this.client, SUBSCRIPTION_PATTERNS.CHANGE_PLAN, {
      id,
      userId,
      plan,
    });
  }

  cancel(id: string, userId: string) {
    return rpcSend(this.client, SUBSCRIPTION_PATTERNS.CANCEL, { id, userId });
  }

  resume(id: string, userId: string) {
    return rpcSend(this.client, SUBSCRIPTION_PATTERNS.RESUME, { id, userId });
  }
}
