import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { PlatformAuth } from 'src/common/decorators/platform-auth.decorator';
import { AuthenticatedUser } from 'src/common/interfaces/current-user-context.type';
import { CreateOnboardingSubscriptionSessionDto } from './dto/create-onboarding-subscription-session.dto';
import { ApiCreateOnboardingSubscriptionSessionResponse } from './decorators/api-create-onboarding-subscription-session-response.decorator';
import { ApiFindMySubscriptionResponse } from './decorators/api-find-my-subscription-response.decorator';
import { ApiFindMySubscriptionHistoryResponse } from './decorators/api-find-my-subscription-history-response.decorator';
import { ChangePlanDto } from './dto/change-plan.dto';
import { ApiGetPlansResponse } from './decorators/api-get-subscription-plans-response.decorator';
import { ApiResumeSubscriptionResponse } from './decorators/api-resume-subscription-response.decorator';

@ApiTags('Subscriptions')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('onboarding/create-session')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiCreateOnboardingSubscriptionSessionResponse(
    CreateOnboardingSubscriptionSessionDto,
  )
  createOnboardingSubscriptionSession(
    @Body() dto: CreateOnboardingSubscriptionSessionDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.subscriptionService.createOnboardingSubscriptionSession(
      dto,
      user.id,
    );
  }

  @Get('plans')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiGetPlansResponse()
  getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('me')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiFindMySubscriptionResponse()
  getMySubscription(@User() user: AuthenticatedUser) {
    return this.subscriptionService.getMySubscription(user.id);
  }

  @Get('me/history')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiFindMySubscriptionHistoryResponse()
  getMySubscriptionHistory(@User() user: AuthenticatedUser) {
    return this.subscriptionService.getMySubscriptionHistory(user.id);
  }

  @Patch('me/:id/plan')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  changePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePlanDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.subscriptionService.changePlan(id, user.id, dto.plan);
  }

  @Delete('me/:id')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: AuthenticatedUser,
  ) {
    return this.subscriptionService.cancel(id, user.id);
  }

  @Patch('me/:id/resume')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiResumeSubscriptionResponse()
  resume(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: AuthenticatedUser,
  ) {
    return this.subscriptionService.resume(id, user.id);
  }
}
