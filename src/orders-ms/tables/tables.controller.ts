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
import { SkipThrottle } from '@nestjs/throttler';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTablePositionsDto } from './dto/update-table-positions.dto';
import { TablesPaginationDto } from './dto/tables-pagination.dto';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiCreateTableResponse } from './decorators/api-create-table-response.decorator';
import { ApiFindAllTablesResponse } from './decorators/api-find-all-tables-response.decorator';
import { ApiFindOneTableResponse } from './decorators/api-find-one-table-response.decorator';
import { ApiUpdateTableResponse } from './decorators/api-update-table-response.decorator';
import { ApiUpdateTablePositionsResponse } from './decorators/api-update-table-positions-response.decorator';
import { ApiDeleteTableResponse } from './decorators/api-delete-table-response.decorator';
import { ApiRestoreTableResponse } from './decorators/api-restore-table-response.decorator';

@ApiTags('Tables')
@Controller('tables')
@SkipThrottle()
export class TablesController {
  constructor(private readonly service: TablesService) {}

  @Post()
  @ApiCreateTableResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(
    @Body() dto: CreateTableDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.create(dto, organizationId);
  }

  @Get()
  @ApiFindAllTablesResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() dto: TablesPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(dto, organizationId);
  }

  @Get(':id')
  @ApiFindOneTableResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  // Declared before PATCH :id so the literal "positions" segment is not
  // swallowed by the :id param matcher.
  @Patch('positions')
  @ApiUpdateTablePositionsResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  updatePositions(
    @Body() dto: UpdateTablePositionsDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.updatePositions(dto, organizationId);
  }

  @Patch(':id')
  @ApiUpdateTableResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTableDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.update(id, dto, organizationId);
  }

  // Declared before PATCH :id/restore so the literal "soft-delete" is not
  // swallowed by the :id param matcher on a potential nested route.
  @Patch(':id/soft-delete')
  @ApiDeleteTableResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.softDelete(id, organizationId);
  }

  @Patch(':id/restore')
  @ApiRestoreTableResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.restore(id, organizationId);
  }
}
