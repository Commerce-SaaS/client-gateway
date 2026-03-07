import { Inject, Injectable } from '@nestjs/common';

import { BaseCrudService } from 'src/common/services/base-crud.service';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';
import { ORDER_STATUS_HISTORY_PATTERNS } from './patterns/order-status-history-patterns';
import { CreateOrderStatusHistoryDto } from './dto/create-order-status-history.dto';
import { UpdateOrderStatusHistoryDto } from './dto/update-order-status-history.dto';

@Injectable()
export class OrderStatusHistoryService extends BaseCrudService<
  CreateOrderStatusHistoryDto,
  UpdateOrderStatusHistoryDto
> {
  constructor(
    @Inject(ORDERS_SERVICE) client: ClientProxy,
  ) {
    super(client, ORDER_STATUS_HISTORY_PATTERNS);
  }
}