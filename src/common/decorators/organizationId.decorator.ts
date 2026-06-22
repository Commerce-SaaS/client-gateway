import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../interfaces/tenant-context.interface';

/**
 * Extracts organizationId from the tenant context (set by TenantMiddleware).
 * Use this on public routes that require a tenant but no authentication.
 * For authenticated routes, use @User() to get the full CurrentUserContext.
 */
export const OrganizationId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const orgId = request.user?.organizationId ?? request.tenant?.organizationId;
    if (!orgId) {
      throw new BadRequestException('Organization context is required...');
    }
    return orgId;
  },
);
