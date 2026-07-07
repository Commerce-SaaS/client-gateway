import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_PATTERNS } from './patterns/order-patterns';
import { ORDERS_SERVICE } from 'src/config/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';
import { FindOneByOrgDto } from './dto/find-one-by-org.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { CreatePosOrderDto } from './dto/create-pos-order.dto';

@Injectable()
export class OrdersService {
  constructor(@Inject(ORDERS_SERVICE) private readonly client: ClientProxy) {}

  create(dto: CreateOrderDto, user: CurrentUserContext) {
    const { organizationId, id, organizationRole } = user;
    return rpcSend(this.client, ORDER_PATTERNS.CREATE, {
      ...dto,
      organizationId,
      userId: organizationRole === OrganizationRole.STAFF ? undefined : id,
    });
  }

  createPosOrder(dto: CreatePosOrderDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.CREATE_POS, { ...dto, organizationId });
  }

  findAll(paginationDto: OrdersPaginationDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.FIND_ALL, {
      ...paginationDto,
      organizationId,
    });
  }

  findOne(dto: FindOneByOrgDto) {
    return rpcSend(this.client, ORDER_PATTERNS.FIND_ONE, dto);
  }

  update(id: string, updateData: UpdateOrderDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.UPDATE, {
      id,
      ...updateData,
      organizationId,
    });
  }

  addItem(orderId: string, item: CreateOrderItemDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.ADD_ITEM, { orderId, organizationId, item });
  }

  removeItem(orderId: string, itemId: string, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.REMOVE_ITEM, { orderId, itemId, organizationId });
  }

  updateOrderItem(orderId: string, itemId: string, dto: UpdateOrderItemDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.UPDATE_ITEM, { orderId, itemId, organizationId, ...dto });
  }

  sendToKitchen(orderId: string, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.SEND_TO_KITCHEN, { orderId, organizationId });
  }

  markItemPrepared(orderId: string, itemId: string, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.MARK_ITEM_PREPARED, { orderId, itemId, organizationId });
  }
}
