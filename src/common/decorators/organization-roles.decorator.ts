import { SetMetadata } from '@nestjs/common';
import { OrganizationRole } from '../enums/organization-roles.enum';

export const ORGANIZATION_ROLES_KEY = 'organizationRoles';

export const OrganizationRoles = (...roles: OrganizationRole[]) =>
  SetMetadata(ORGANIZATION_ROLES_KEY, roles);
