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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PaginationDto } from 'src/common';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { ApiFindOneResponse } from 'src/common/decorators/swagger/api-find-one-response.decorator';

@Controller('orders')
@PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiCreateResponse(CreateOrderDto)
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
  )
  create(@Body() dto: CreateOrderDto, @User() user: CurrentUserContext) {
    return this.service.create(dto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @ApiFindOneResponse('Orders')
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
  )
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.cancel(id, user.organizationId);
  }
}
