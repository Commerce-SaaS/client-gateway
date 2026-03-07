import { applyDecorators, UseGuards } from "@nestjs/common";
import { PlatformRolesEnum } from "../enums/platform-roles.enum";
import { AuthSessionGuard } from "../guards/auth-session.guard";
import { PlatformRolesGuard } from "../guards/platform-roles.guard";
import { PlatformRoles } from "./platform-roles.decorator";

export function PlatformAuth(...types: PlatformRolesEnum[]) {
  return applyDecorators(
    UseGuards(AuthSessionGuard, PlatformRolesGuard),
    PlatformRoles(...types),
  );
}