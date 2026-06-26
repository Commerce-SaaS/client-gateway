import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { ApiFindOneResponse } from 'src/common/decorators/swagger/api-find-one-response.decorator';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiFindMyOrdersResponse } from './decorators/api-find-my-orders-response.decorator';
import { ApiFindAllOrdersResponse } from './decorators/api-find-all-orders-response.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiCreateResponse(CreateOrderDto)
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
    ['customer', 'saas'],
  )
  create(@Body() dto: CreateOrderDto, @User() user: CurrentUserContext) {
    this.logger.log(
      `[ORDER-FLOW] gateway create-order: userId=${user.id} organizationId=${user.organizationId} itemCount=${dto.items?.length ?? 0}`,
    );
    return this.service.create(dto, user);
  }

  @Get('me')
  @ApiFindMyOrdersResponse()
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.CUSTOMER],
    ['customer'],
  )
  findMyOrders(
    @User() user: CurrentUserContext,
    @Query() paginationDto: OrdersPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(
      { ...paginationDto, userId: user.id },
      organizationId,
    );
  }

  @Get('me/:id')
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.CUSTOMER],
    ['customer'],
  )
  findMyOrderById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne({id, organizationId, userId: user.id});
  }

  @Get()
  @ApiFindAllOrdersResponse('Order')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() paginationDto: OrdersPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @ApiFindOneResponse('Order')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne({id, organizationId});
  }

  @Patch(':id')
  @ApiUpdateResponse(UpdateOrderDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateOrderDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.update(id, updateData, organizationId);
  }
}
