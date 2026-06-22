import {
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { TenantContext } from '../interfaces/tenant-context.interface';

/**
 * Guard for public routes that require a tenant context.
 * Validates that the TenantMiddleware resolved an organizationId
 * from either domain or header.
 *
 * Use via @PublicTenant() decorator on public product/order listing routes.
 */
@Injectable()
export class TenantRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenant: TenantContext | undefined = request.tenant;

    if (!tenant?.organizationId) {
      throw new BadRequestException(
        'Organization context is required. Provide x-organization-id header or access via organization domain.',
      );
    }

    return true;
  }
}
