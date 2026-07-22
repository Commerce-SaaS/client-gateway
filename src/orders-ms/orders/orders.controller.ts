import {
  Body,
  Controller,
  Delete,
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
import { ApiUpdateOrderResponse } from './decorators/api-update-order-response.decorator';
import { ApiFindMyOrdersResponse } from './decorators/api-find-my-orders-response.decorator';
import { ApiFindAllOrdersResponse } from './decorators/api-find-all-orders-response.decorator';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiAddOrderItemResponse } from './decorators/api-add-order-item-response.decorator';
import { ApiRemoveOrderItemResponse } from './decorators/api-remove-order-item-response.decorator';
import { ApiUpdateOrderItemResponse } from './decorators/api-update-order-item-response.decorator';
import { ApiCreatePosOrderResponse } from './decorators/api-create-pos-order-response.decorator';
import { CreatePosOrderDto } from './dto/create-pos-order.dto';
import { ApiSendToKitchenResponse } from './decorators/api-send-to-kitchen-response.decorator';
import { ApiMarkItemPreparedResponse } from './decorators/api-mark-item-prepared-response.decorator';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Orders')
@Controller('orders')
@SkipThrottle()
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

  @Post('pos')
  @ApiCreatePosOrderResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  createPosOrder(
    @Body() dto: CreatePosOrderDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.createPosOrder(dto, organizationId);
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
    return this.service.findOne({ id, organizationId, userId: user.id });
  }

  // Declared before GET :id so the literal segment "available-slots" is not
  // swallowed by the :id param matcher.
  @Get('available-slots')
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
    ['customer', 'saas'],
  )
  getAvailableSlots(
    @Query() dto: GetAvailableSlotsDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.getAvailableSlots(dto, organizationId);
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
    return this.service.findOne({ id, organizationId });
  }

  @Patch(':id')
  @ApiUpdateOrderResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateOrderDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.update(id, updateData, organizationId);
  }

  // ─── Item endpoints ────────────────────────────────────────────────────────

  @Post(':id/items')
  @ApiAddOrderItemResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateOrderItemDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.addItem(id, dto, organizationId);
  }

  @Delete(':id/items/:itemId')
  @ApiRemoveOrderItemResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.removeItem(id, itemId, organizationId);
  }

  // Declared before PATCH :id/items/:itemId so the literal segment
  // "send-to-kitchen" is not swallowed by the :itemId param matcher.
  @Patch(':id/items/send-to-kitchen')
  @ApiSendToKitchenResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  sendToKitchen(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.sendToKitchen(id, organizationId);
  }

  @Patch(':id/items/:itemId/prepared')
  @ApiMarkItemPreparedResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  markItemPrepared(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.markItemPrepared(id, itemId, organizationId);
  }

  @Patch(':id/items/:itemId')
  @ApiUpdateOrderItemResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  updateOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateOrderItemDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.updateOrderItem(id, itemId, dto, organizationId);
  }
}
