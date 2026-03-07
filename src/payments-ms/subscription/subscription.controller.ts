import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { CreateSubscriptionSessionDto } from './dto/create-subscription-session.dto';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiCreateSubscriptionSessionResponse } from './decorators/api-create-subscription-session-response.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create-session')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  @ApiCreateSubscriptionSessionResponse(CreateSubscriptionSessionDto)
  createSubscriptionSession(
    @Body() createSubscriptionSessionDto: CreateSubscriptionSessionDto,
    @OrganizationId() organizationId: string,
    @User() user: CurrentUserContext,
  ) {
    return this.subscriptionService.createSubscriptionSession(
      createSubscriptionSessionDto,
      organizationId,
      user,
    );
  }
}
