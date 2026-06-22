import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { CrudService } from '../interfaces/crud-service.interface';
import { rpcSend } from '../utils/rpc.utils';

export abstract class BaseCrudService<CreateDto, UpdateDto>
  implements CrudService<CreateDto, UpdateDto>
{
  protected constructor(
    protected readonly client: ClientProxy,
    protected readonly patterns: {
      CREATE: string;
      FIND_ALL: string;
      FIND_ONE: string;
      UPDATE: string;
      DELETE: string;
      RESTORE: string;
    },
  ) {}

  create(dto: CreateDto, organizationId?: string) {
    return rpcSend(this.client, this.patterns.CREATE, {
      ...dto,
      organizationId,
    });
  }

  findAll(paginationDto: PaginationDto, organizationId: string) {
    return rpcSend(this.client, this.patterns.FIND_ALL, {
      ...paginationDto,
      organizationId,
    });
  }

  findOne(id: string, organizationId?: string) {
    return rpcSend(this.client, this.patterns.FIND_ONE, { id, organizationId });
  }

  update(id: string, dto: UpdateDto, organizationId: string) {
    return rpcSend(this.client, this.patterns.UPDATE, {
      id,
      ...dto,
      organizationId,
    });
  }

  remove(id: string, organizationId: string) {
    return rpcSend(this.client, this.patterns.DELETE, { id, organizationId });
  }

  restore(id: string, organizationId: string) {
    return rpcSend(this.client, this.patterns.RESTORE, { id, organizationId });
  }
}
