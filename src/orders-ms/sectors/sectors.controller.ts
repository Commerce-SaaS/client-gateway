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
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorsPaginationDto } from './dto/sectors-pagination.dto';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiCreateSectorResponse } from './decorators/api-create-sector-response.decorator';
import { ApiFindAllSectorsResponse } from './decorators/api-find-all-sectors-response.decorator';
import { ApiFindOneSectorResponse } from './decorators/api-find-one-sector-response.decorator';
import { ApiUpdateSectorResponse } from './decorators/api-update-sector-response.decorator';
import { ApiDeleteSectorResponse } from './decorators/api-delete-sector-response.decorator';
import { ApiRestoreSectorResponse } from './decorators/api-restore-sector-response.decorator';

@ApiTags('Sectors')
@Controller('sectors')
@SkipThrottle()
export class SectorsController {
  constructor(private readonly service: SectorsService) {}

  @Post()
  @ApiCreateSectorResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(
    @Body() dto: CreateSectorDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.create(dto, organizationId);
  }

  @Get()
  @ApiFindAllSectorsResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() dto: SectorsPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(dto, organizationId);
  }

  @Get(':id')
  @ApiFindOneSectorResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdateSectorResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSectorDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.update(id, dto, organizationId);
  }

  @Patch(':id/soft-delete')
  @ApiDeleteSectorResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.softDelete(id, organizationId);
  }

  @Patch(':id/restore')
  @ApiRestoreSectorResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.restore(id, organizationId);
  }
}
