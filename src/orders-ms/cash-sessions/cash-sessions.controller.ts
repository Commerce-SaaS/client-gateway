import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { CashSessionsService } from './cash-sessions.service';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CashSessionsPaginationDto } from './dto/cash-sessions-pagination.dto';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiOpenCashSessionResponse } from './decorators/api-open-cash-session-response.decorator';
import { ApiCloseCashSessionResponse } from './decorators/api-close-cash-session-response.decorator';
import { ApiCurrentCashSessionResponse } from './decorators/api-current-cash-session-response.decorator';
import { ApiFindOneCashSessionResponse } from './decorators/api-find-one-cash-session-response.decorator';
import { ApiFindAllCashSessionsResponse } from './decorators/api-find-all-cash-sessions-response.decorator';
import { ApiCashSessionReportResponse } from './decorators/api-cash-session-report-response.decorator';

@ApiTags('Cash Sessions')
@Controller('cash-sessions')
@SkipThrottle()
export class CashSessionsController {
  constructor(private readonly service: CashSessionsService) {}

  @Post('open')
  @ApiOpenCashSessionResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  open(
    @Body() dto: OpenCashSessionDto,
    @OrganizationId() organizationId: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.open(dto, organizationId, user.id);
  }

  // Declared before GET :id so the literal "current" segment is not swallowed
  // by the :id param matcher.
  @Get('current')
  @ApiCurrentCashSessionResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  current(@OrganizationId() organizationId: string) {
    return this.service.current(organizationId);
  }

  @Get()
  @ApiFindAllCashSessionsResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() dto: CashSessionsPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(dto, organizationId);
  }

  @Get(':id')
  @ApiFindOneCashSessionResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Get(':id/report')
  @ApiCashSessionReportResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  report(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.report(id, organizationId);
  }

  @Post(':id/close')
  @ApiCloseCashSessionResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseCashSessionDto,
    @OrganizationId() organizationId: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.close(id, dto, organizationId, user.id);
  }
}
