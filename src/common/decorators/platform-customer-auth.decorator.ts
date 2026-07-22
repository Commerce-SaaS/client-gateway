import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { PlatformRolesEnum } from '../enums/platform-roles.enum';
import { AuthSessionGuard, AUTH_AUDIENCE_KEY } from '../guards/auth-session.guard';
import { PlatformRolesGuard } from '../guards/platform-roles.guard';
import { PlatformRoles } from './platform-roles.decorator';

export function PlatformCustomerAuth(...roles: PlatformRolesEnum[]) {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    SetMetadata(AUTH_AUDIENCE_KEY, 'customer'),
    UseGuards(AuthSessionGuard, PlatformRolesGuard),
    PlatformRoles(...roles),
  );
}