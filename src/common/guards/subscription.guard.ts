import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import Redis from 'ioredis';
import { firstValueFrom, timeout, catchError } from 'rxjs';

export const SUBSCRIPTION_REQUIRED_KEY = 'subscriptionRequired';
export const SUBSCRIPTION_PLANS_KEY = 'subscriptionPlans';

export interface CachedSubscription {
  active: boolean;
  plan: string;
  status: string;
  expiresAt: string | null;
}

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private static readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(
      SUBSCRIPTION_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User context required');
    }

    const sub = await this.getSubscription(userId);

    if (!sub.active) {
      throw new ForbiddenException(
        'Organization subscription is not active. Current status: ' +
          sub.status,
      );
    }

    // Check required plans (e.g., PRO-only features)
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(
      SUBSCRIPTION_PLANS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPlans?.length && !requiredPlans.includes(sub.plan)) {
      throw new ForbiddenException(
        `This feature requires one of: ${requiredPlans.join(', ')}. Current plan: ${sub.plan}`,
      );
    }

    request.subscription = sub;

    return true;
  }

  private async getSubscription(
    userId: string,
  ): Promise<CachedSubscription> {
    const cacheKey = `sub:user:${userId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss → RPC to payments-ms
    const result = await firstValueFrom(
      this.paymentClient
        .send<CachedSubscription>('access.check', { userId })
        .pipe(
          timeout(5000),
          catchError((err) => {
            throw new ForbiddenException(
              'Unable to verify subscription status',
            );
          }),
        ),
    );

    await this.redis.set(
      cacheKey,
      JSON.stringify(result),
      'EX',
      SubscriptionGuard.CACHE_TTL,
    );

    return result;
  }
}
