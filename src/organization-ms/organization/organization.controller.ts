import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { ApiFindOneResponse } from 'src/common/decorators/swagger/api-find-one-response.decorator';
import { ApiCreateOrganizationResponse } from './decorators/api-create-organization-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { PlatformAuth } from 'src/common/decorators/platform-auth.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Post()
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @ApiCreateOrganizationResponse(CreateOrganizationDto)
  create(@Body() dto: CreateOrganizationDto, @User() user: CurrentUserContext) {
    return this.service.create(dto, user.organizationId);
  }

  @Get(':id')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  @ApiFindOneResponse('Organization')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateOrganizationDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
    @User() user: CurrentUserContext,
  ) {
    return this.service.update(id, dto, user.organizationId);
  }

  @Patch(':id/soft-delete')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  @ApiSoftDeleteResponse('Organization')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.remove(id, user.organizationId);
  }
}
