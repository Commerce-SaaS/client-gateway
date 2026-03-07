import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import Redis from "ioredis";
import { CurrentUserContext } from "../interfaces/current-user-context.type";

interface Organization {
      organizationId:   string;
      role:             string;
      email:            string;
      stripeAccountId?: string;
    }

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const organizationId = request['organizationId'];

    if (!organizationId || Array.isArray(organizationId)) {
      throw new UnauthorizedException('Invalid organization header');
    }

    const orgs = await this.redis.get(`user:${request.user.id}:orgs`);
    if (!orgs) {
      throw new UnauthorizedException('Organizations not found');
    }

    const orgsParsed = JSON.parse(orgs);

    const organization: Organization = orgsParsed.find(
      (o) => o.organizationId === organizationId,
    );

    if (!organization) {
      throw new UnauthorizedException('No access to this organization');
    }

    request.user = {
      ...request.user,
      organizationRole: organization.role,
      organizationId,
    } satisfies CurrentUserContext;

    return true;
  }
}
