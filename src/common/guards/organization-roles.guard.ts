import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ORGANIZATION_ROLES_KEY } from '../decorators/organization-roles.decorator';
import { OrganizationRole } from '../enums/organization-roles.enum';
import { CurrentUserContext } from '../interfaces/current-user-context.type';


@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<OrganizationRole[]>(
        ORGANIZATION_ROLES_KEY,
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

    const hasRole = requiredRoles.includes(user.organizationRole);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
