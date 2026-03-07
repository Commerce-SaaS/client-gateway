import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserContext } from '../interfaces/current-user-context.type';
import { PlatformRolesEnum } from '../enums/platform-roles.enum';
import { PLATFORM_ROLES_KEY } from '../decorators/platform-roles.decorator';

@Injectable()
export class PlatformRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<PlatformRolesEnum[]>(
      PLATFORM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserContext = request.user;

    if (!user) {
      throw new ForbiddenException('User context not found');
    }

    const hasType = requiredRoles.includes(user.platformRole);
    if (!hasType) {
      throw new ForbiddenException('Insufficient user type');
    }

    return true;
  }
}
