import { SetMetadata } from '@nestjs/common';
import { PlatformRolesEnum } from '../enums/platform-roles.enum';

export const PLATFORM_ROLES_KEY = 'platformRoles';

export const PlatformRoles = (...roles: PlatformRolesEnum[]) =>
  SetMetadata(PLATFORM_ROLES_KEY, roles);