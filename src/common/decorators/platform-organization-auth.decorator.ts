import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { OrganizationRole } from '../enums/organization-roles.enum';
import { OrganizationGuard } from '../guards/organization.guard';
import { OrganizationRolesGuard } from '../guards/organization-roles.guard';
import { OrganizationRoles } from './organization-roles.decorator';
import { PlatformRolesEnum } from '../enums/platform-roles.enum';
import { AuthSessionGuard, AUTH_AUDIENCE_KEY } from '../guards/auth-session.guard';
import { PlatformRolesGuard } from '../guards/platform-roles.guard';
import { PlatformRoles } from './platform-roles.decorator';
import {
  SubscriptionGuard,
  SUBSCRIPTION_REQUIRED_KEY,
} from '../guards/subscription.guard';

interface PlatformOrganizationAuthOptions {
  subscriptionRequired?: boolean;
}

export function PlatformOrganizationAuth(
  platformRoles: PlatformRolesEnum[],
  orgRoles: OrganizationRole[],
  audience: 'saas' | 'customer' | Array<'saas' | 'customer'> = 'saas',
  options?: PlatformOrganizationAuthOptions,
) {
  const guards: any[] = [
    AuthSessionGuard,
    PlatformRolesGuard,
    OrganizationGuard,
    OrganizationRolesGuard,
  ];

  if (options?.subscriptionRequired) {
    guards.push(SubscriptionGuard);
  }

  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    SetMetadata(AUTH_AUDIENCE_KEY, audience),
    SetMetadata(
      SUBSCRIPTION_REQUIRED_KEY,
      options?.subscriptionRequired ?? false,
    ),
    UseGuards(...guards),
    PlatformRoles(...platformRoles),
    OrganizationRoles(...orgRoles),
  );
}
