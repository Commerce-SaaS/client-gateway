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
}
