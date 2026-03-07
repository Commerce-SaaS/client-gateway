import { SetMetadata } from '@nestjs/common';
import { OrganizationRole } from '../enums/organization-roles.enum';

export const ROLES_KEY = 'roles';

export const OrganizationRoles = (...roles: OrganizationRole[]) =>
  SetMetadata(ROLES_KEY, roles);
