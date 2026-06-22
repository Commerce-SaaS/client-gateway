import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationDomainsService } from './organization_domains.service';
import { User } from 'src/common/decorators/user.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreateOrganizationDomainDto } from './dto/create-organization_domain.dto';
import { UpdateOrganizationDomainDto } from './dto/update-organization_domain.dto';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiDeleteResponse } from 'src/common/decorators/swagger/api-delete-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { ApiResolveOrganizationByDomain } from './decorators/api-resolve-organization-by-domain-response.decorator';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';

@ApiTags('Organization Domains')
@Controller('organization-domains')
export class OrganizationDomainsController {
  constructor(private readonly service: OrganizationDomainsService) {}

  @Post()
  @ApiCreateResponse(CreateOrganizationDomainDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(
    @Body() dto: CreateOrganizationDomainDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.create(dto, organizationId);
  }

  @Get()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(@OrganizationId() organizationId: string) {
    return this.service.findAll({}, organizationId);
  }

  @Get(':domain')
  @ApiResolveOrganizationByDomain('Organization')
  findOne(@Param('domain') domain: string) {
    return this.service.findOne(domain);
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateOrganizationDomainDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDomainDto,
    @User() user: CurrentUserContext,
  ) {
    return this.service.update(id, dto, user.organizationId);
  }

  @Delete(':id')
  @ApiDeleteResponse('OrganizationDomain')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    console.log(id, organizationId)
    return this.service.remove(id, organizationId);
  }
}
