import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { TABLE_PATTERNS } from './patterns/table-patterns';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTablePositionsDto } from './dto/update-table-positions.dto';
import { TablesPaginationDto } from './dto/tables-pagination.dto';

@Injectable()
export class TablesService {
  constructor(@Inject(ORDERS_SERVICE) private readonly client: ClientProxy) {}

  create(dto: CreateTableDto, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.CREATE, { ...dto, organizationId });
  }

  findAll(dto: TablesPaginationDto, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.FIND_ALL, { ...dto, organizationId });
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.FIND_ONE, { id, organizationId });
  }

  update(id: string, dto: UpdateTableDto, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.UPDATE, { id, ...dto, organizationId });
  }

  updatePositions(dto: UpdateTablePositionsDto, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.UPDATE_POSITIONS, { ...dto, organizationId });
  }

  softDelete(id: string, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.SOFT_DELETE, { id, organizationId });
  }

  restore(id: string, organizationId: string) {
    return rpcSend(this.client, TABLE_PATTERNS.RESTORE, { id, organizationId });
  }
}
