import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import Redis from "ioredis";
import { CurrentUserContext } from "../interfaces/current-user-context.type";
import { TenantContext } from "../interfaces/tenant-context.interface";

interface OrganizationMembership {
  organizationId: string;
  role: string;
  email: string;
  stripeAccountId?: string;
}

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get organizationId from tenant context (set by TenantMiddleware)
    const tenant: TenantContext | undefined = request.tenant;
    const organizationId = tenant?.organizationId;

    if (!organizationId) {
      throw new UnauthorizedException(
        'Organization context is required. Provide x-organization-id header or access via organization domain.',
      );
    }

    // Validate the authenticated user has membership in this organization
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User context not found');
    }

    const orgs = await this.redis.get(`user:${userId}:orgs`);
    if (!orgs) {
      throw new UnauthorizedException('Organizations not found');
    }

    let orgsParsed: OrganizationMembership[];
    try {
      orgsParsed = JSON.parse(orgs);
    } catch {
      throw new UnauthorizedException('Invalid organizations data');
    }

    const membership = orgsParsed.find(
      (o) => o.organizationId === organizationId,
    );

    if (!membership) {
      throw new UnauthorizedException('No access to this organization');
    }

    // Populate the full user context with validated organization data
    request.user = {
      ...request.user,
      organizationId,
      organizationRole: membership.role,
      stripeAccountId: membership.stripeAccountId ?? null,
      email: membership.email,
    } satisfies CurrentUserContext;

    return true;
  }
}
