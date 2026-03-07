import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserOrganizationService } from './user_organization.service';
import { CreateUserOrganizationDto } from './dto/create-user_organization.dto';
import { UpdateUserOrganizationDto } from './dto/update-user_organization.dto';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';

@Controller('memberships')
@PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
export class UserOrganizationController {
  constructor(
    private readonly userOrganizationService: UserOrganizationService,
  ) {}

  @Post()
  @ApiCreateResponse(CreateUserOrganizationDto)
  create(@Body() createUserOrganizationDto: CreateUserOrganizationDto) {
    return this.userOrganizationService.create(createUserOrganizationDto);
  }

  @Get('user/:id/organizations')
  findOrganizationsByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.findOrganizationsByUser(id);
  }

  @Get('organization/:id/users')
  findUsersByOrganization(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.findUsersByOrganization(id);
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateUserOrganizationDto)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserOrganizationDto: UpdateUserOrganizationDto,
  ) {
    return this.userOrganizationService.update(id, updateUserOrganizationDto);
  }

  @Patch(':id/soft-delete')
  @ApiSoftDeleteResponse('UserOrganization')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.restore(id);
  }
}
