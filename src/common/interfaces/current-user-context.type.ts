import { OrganizationRole } from "../enums/organization-roles.enum";
import { PlatformRolesEnum } from "../enums/platform-roles.enum";

export interface CurrentUserContext {
  id: string;
  organizationId: string;
  organizationRole: OrganizationRole;
  platformRole: PlatformRolesEnum;
  stripeAccountId: string | null;
  email: string;
}
