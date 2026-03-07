import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { StripeService } from './stripe.service';
import { ApiConnectStripeResponse } from './decorators/api-create-payment-session-response.decorator';

@Controller('connect')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('account')
  @ApiConnectStripeResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  async connect(@User() user: CurrentUserContext) {
    return this.stripeService.connectAccount(user);
  }
}
