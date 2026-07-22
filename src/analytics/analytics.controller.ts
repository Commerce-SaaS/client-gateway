import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics.service';
import { GetAnalyticsDto } from './dto/get-analytics.dto';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiGetAnalytics } from './decorators/api-get-analytics.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@SkipThrottle()
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get()
  @ApiGetAnalytics()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  getAnalytics(
    @Query() dto: GetAnalyticsDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.getAnalytics(dto, organizationId);
  }
}
