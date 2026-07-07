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
import { PaginationDto } from 'src/common';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { ApiFindOnePublicResponse } from 'src/common/decorators/swagger/api-find-one-public-response.decorator';
import { ApiFindAllPublicResponse } from 'src/common/decorators/swagger/api-find-all-public-response.decorator';
import { ApiRestoreResponse } from 'src/common/decorators/swagger/api-restore-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Post()
  @ApiCreateResponse(CreateCategoryDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(@Body() dto: CreateCategoryDto, @User() user: CurrentUserContext) {
    return this.service.create(dto, user.organizationId);
  }

  @Get()
  @SkipThrottle()
  @ApiFindAllPublicResponse('Category')
  findAll(
    @Query() paginationDto: PaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @SkipThrottle()
  @ApiFindOnePublicResponse('Category')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateCategoryDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
    @User() user: CurrentUserContext,
  ) {
    return this.service.update(id, dto, user.organizationId);
  }

  @Patch(':id/soft-delete')
  @ApiSoftDeleteResponse('Category')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.remove(id, user.organizationId);
  }

  @Patch(':id/restore')
  @ApiRestoreResponse('Category')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.restore(id, user.organizationId);
  }
}
