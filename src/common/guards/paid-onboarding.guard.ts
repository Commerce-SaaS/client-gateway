import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/config/services';
import { rpcSend } from '../utils/rpc.utils';

@Injectable()
export class PaidOnboardingGuard implements CanActivate {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id as string | undefined;

    if (!userId) {
      throw new ForbiddenException('User context not found');
    }

    const result = await rpcSend<{ paid: boolean }>(
      this.paymentClient,
      'access.check_onboarding',
      { userId },
    );

    if (!result?.paid) {
      throw new ForbiddenException(
        'You must complete onboarding subscription payment before creating an organization',
      );
    }

    return true;
  }
}
