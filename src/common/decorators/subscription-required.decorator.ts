import { SetMetadata } from '@nestjs/common';
import {
  SUBSCRIPTION_REQUIRED_KEY,
  SUBSCRIPTION_PLANS_KEY,
} from '../guards/subscription.guard';

/**
 * Mark a route as requiring an active subscription.
 * Optionally restrict to specific plans: @SubscriptionRequired('PRO', 'BASIC')
 */
export function SubscriptionRequired(...plans: string[]) {
  return (target: any, key?: any, descriptor?: any) => {
    SetMetadata(SUBSCRIPTION_REQUIRED_KEY, true)(target, key, descriptor);
    if (plans.length > 0) {
      SetMetadata(SUBSCRIPTION_PLANS_KEY, plans)(target, key, descriptor);
    }
  };
}
