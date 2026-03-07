import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_PATTERNS } from './patterns/order-patterns';
import { ORDERS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';

@Injectable()
export class OrdersService {
  constructor(@Inject(ORDERS_SERVICE) private readonly client: ClientProxy) {}
  
  create(dto: CreateOrderDto, user: CurrentUserContext) {
    const { organizationId, id, organizationRole } = user;
    return firstValueFrom(
      this.client.send(ORDER_PATTERNS.CREATE, {
        ...dto,
        organizationId,
        userId: organizationRole === OrganizationRole.STAFF ? undefined : id, 
      }),
    );
  }

  findAll(paginationDto: PaginationDto, organizationId: string) {
    return firstValueFrom(
      this.client.send(ORDER_PATTERNS.FIND_ALL, {
        ...paginationDto,
        organizationId,
      }),
    );
  }

  findOne(id: string, organizationId: string) {
    return firstValueFrom(
      this.client.send(ORDER_PATTERNS.FIND_ONE, { id, organizationId }),
    );
  }
  cancel(id: string, organizationId: string) {
    return firstValueFrom(
      this.client.send(ORDER_PATTERNS.CANCEL, { id, organizationId }),
    );
  }
}
