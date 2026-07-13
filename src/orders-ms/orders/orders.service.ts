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
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { ProductsService } from 'src/product-ms/products/product.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly client: ClientProxy,
    private readonly productsService: ProductsService,
  ) {}

  // Resolves each item's countsTowardKitchenCapacity snapshot from its
  // product's category before the order is forwarded to orders-ms (which has
  // no dependency on product-ms). Defaults to true (conservative) when a
  // product/category can't be resolved.
  private async resolveKitchenCapacityFlags<T extends { productId: string }>(
    items: T[],
    organizationId: string,
  ): Promise<(T & { countsTowardKitchenCapacity: boolean })[]> {
    const uniqueProductIds = [...new Set(items.map((item) => item.productId))];
    const products = await Promise.all(
      uniqueProductIds.map((productId) =>
        this.productsService.findOne(productId, organizationId).catch(() => null),
      ),
    );
    const flagByProductId = new Map(
      uniqueProductIds.map((productId, index) => [
        productId,
        products[index]?.category?.countsTowardKitchenCapacity ?? true,
      ]),
    );
    return items.map((item) => ({
      ...item,
      countsTowardKitchenCapacity: flagByProductId.get(item.productId) ?? true,
    }));
  }

  async create(dto: CreateOrderDto, user: CurrentUserContext) {
    const { organizationId, id, organizationRole } = user;
    const items = await this.resolveKitchenCapacityFlags(dto.items, organizationId);
    return rpcSend(this.client, ORDER_PATTERNS.CREATE, {
      ...dto,
      items,
      organizationId,
      userId: organizationRole === OrganizationRole.STAFF ? undefined : id,
    });
  }

  createPosOrder(dto: CreatePosOrderDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.CREATE_POS, { ...dto, organizationId });
  }

  getAvailableSlots(dto: GetAvailableSlotsDto, organizationId: string) {
    return rpcSend(this.client, ORDER_PATTERNS.AVAILABLE_SLOTS, { ...dto, organizationId });
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

  async addItem(orderId: string, item: CreateOrderItemDto, organizationId: string) {
    const [resolvedItem] = await this.resolveKitchenCapacityFlags([item], organizationId);
    return rpcSend(this.client, ORDER_PATTERNS.ADD_ITEM, {
      orderId,
      organizationId,
      item: resolvedItem,
    });
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
