import { OrganizationRole } from '../enums/organization-roles.enum';
import { PlatformRolesEnum } from '../enums/platform-roles.enum';

/**
 * Partial context set by AuthSessionGuard (before org resolution).
 */
export interface AuthenticatedUser {
  id: string;
  platformRole: PlatformRolesEnum;
  aud: 'saas' | 'customer';
}

/**
 * Full context set by OrganizationGuard (after org membership validation).
 */
export interface CurrentUserContext extends AuthenticatedUser {
  organizationId: string;
  organizationRole: OrganizationRole;
  stripeAccountId: string | null;
  email: string;
}
