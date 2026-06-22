import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiCreateOrganizationResponse } from './decorators/api-create-organization-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformAuth } from 'src/common/decorators/platform-auth.decorator';
import { AuthenticatedUser } from 'src/common/interfaces/current-user-context.type';
import { PaidOnboardingGuard } from 'src/common/guards/paid-onboarding.guard';
import { AuthSessionGuard } from 'src/common/guards/auth-session.guard';
import { PlatformRolesGuard } from 'src/common/guards/platform-roles.guard';

@ApiTags('Organizations')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Post()
  @PlatformAuth(PlatformRolesEnum.STAFF)
  @UseGuards(AuthSessionGuard, PlatformRolesGuard, PaidOnboardingGuard)
  @ApiCreateOrganizationResponse(CreateOrganizationDto)
  create(@Body() dto: CreateOrganizationDto, @User() user: AuthenticatedUser) {
    return this.service.create({
      ...dto,
      ownerId: user.id,
    });
  }

  @Get('')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(@User() user: CurrentUserContext) {
    const { organizationId } = user;
    return this.service.findOne(organizationId);
  }

  @Patch('')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(@Body() dto: UpdateOrganizationDto, @User() user: CurrentUserContext) {
    const { organizationId } = user;
    return this.service.update(organizationId, dto, organizationId);
  }

  @Patch('soft-delete')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  remove(@User() user: CurrentUserContext) {
    const { organizationId } = user;
    return this.service.remove(organizationId, organizationId);
  }
}
