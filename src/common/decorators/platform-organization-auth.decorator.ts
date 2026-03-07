import { applyDecorators, UseGuards } from "@nestjs/common";
import { OrganizationRole } from "../enums/organization-roles.enum";
import { OrganizationGuard } from "../guards/organization.guard";
import { OrganizationRolesGuard } from "../guards/organization-roles.guard";
import { OrganizationRoles } from "./organization-roles.decorator";
import { PlatformRolesEnum } from "../enums/platform-roles.enum";
import { AuthSessionGuard } from "../guards/auth-session.guard";
import { PlatformRolesGuard } from "../guards/platform-roles.guard";
import { PlatformRoles } from "./platform-roles.decorator";

export function PlatformOrganizationAuth(
  platformRoles: PlatformRolesEnum[],
  orgRoles: OrganizationRole[],
) {
  return applyDecorators(
    UseGuards(
      AuthSessionGuard,
      PlatformRolesGuard,
      OrganizationGuard,
      OrganizationRolesGuard,
    ),
    PlatformRoles(...platformRoles),
    OrganizationRoles(...orgRoles),
  );
}
