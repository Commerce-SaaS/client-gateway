import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ExtrasService } from './extras.service';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { PaginationDto } from 'src/common';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { ApiFindOnePublicResponse } from 'src/common/decorators/swagger/api-find-one-public-response.decorator';
import { ApiFindAllPublicResponse } from 'src/common/decorators/swagger/api-find-all-public-response.decorator';
import { ApiRestoreResponse } from 'src/common/decorators/swagger/api-restore-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';

@ApiTags('Extras')
@Controller('extras')
export class ExtrasController {
  constructor(private readonly service: ExtrasService) {}
  @Post()
  @ApiCreateResponse(CreateExtraDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(@Body() dto: CreateExtraDto, @User() user: CurrentUserContext) {
    return this.service.create(dto, user.organizationId);
  }

  @Get()
  @ApiFindAllPublicResponse('Extra')
  findAll(
    @Query() paginationDto: PaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @ApiFindOnePublicResponse('Extra')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateExtraDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExtraDto,
    @User() user: CurrentUserContext,
  ) {
    return this.service.update(id, dto, user.organizationId);
  }

  @Patch(':id/soft-delete')
  @ApiSoftDeleteResponse('Extra')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.remove(id, user.organizationId);
  }

  @Patch(':id/restore')
  @ApiRestoreResponse('Extra')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.restore(id, user.organizationId);
  }
}
