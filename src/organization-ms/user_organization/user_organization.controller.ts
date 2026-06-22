import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserOrganizationService } from './user_organization.service';
import { CreateUserOrganizationDto } from './dto/create-user_organization.dto';
import { UpdateUserOrganizationDto } from './dto/update-user_organization.dto';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { ApiRestoreResponse } from 'src/common/decorators/swagger/api-restore-response.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';

@ApiTags('Memberships')
@Controller('memberships')
@PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
export class UserOrganizationController {
  constructor(
    private readonly userOrganizationService: UserOrganizationService,
  ) {}

  @Get('user/organizations')
  @ApiOperation({ summary: 'List all organizations for a user' })
  findOrganizationsByUser(@User() user: CurrentUserContext) {
    return this.userOrganizationService.findOrganizationsByUser(user.id);
  }

  @Get('organization/users')
  @ApiOperation({ summary: 'List all users in an organization'})
  findUsersByOrganization(@OrganizationId() organizationId: string) {
    return this.userOrganizationService.findUsersByOrganization(organizationId);
  }

  // @Patch(':id')
  // @ApiUpdateResponse(UpdateUserOrganizationDto)
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateUserOrganizationDto: UpdateUserOrganizationDto,
  // ) {
  //   return this.userOrganizationService.update(id, updateUserOrganizationDto);
  // }

  @Patch(':id/soft-delete')
  @ApiSoftDeleteResponse('UserOrganization')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.remove(id);
  }

  @Patch(':id/restore')
  @ApiRestoreResponse('UserOrganization')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userOrganizationService.restore(id);
  }
}
