import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CrudService } from '../interfaces/crud-service.interface';

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

  create(dto: CreateDto, organizationId: string) {
    return firstValueFrom(
      this.client.send(this.patterns.CREATE, {
        ...dto,
        organizationId,
      }),
    );
  }

  findAll(paginationDto: PaginationDto, organizationId: string) {
    return firstValueFrom(
      this.client.send(this.patterns.FIND_ALL, {
        ...paginationDto,
        organizationId,
      }),
    );
  }

  findOne(domain: string, organizationId?: string) {
    return firstValueFrom(
      this.client.send(this.patterns.FIND_ONE, { domain, organizationId }),
    );
  }

  update(id: string, dto: UpdateDto, organizationId: string) {
    return firstValueFrom(
      this.client.send(this.patterns.UPDATE, {
        id,
        ...dto,
        organizationId,
      }),
    );
  }

  remove(id: string, organizationId: string) {
    return firstValueFrom(
      this.client.send(this.patterns.DELETE, { id, organizationId }),
    );
  }

  restore(id: string, organizationId: string) {
    return firstValueFrom(
      this.client.send(this.patterns.RESTORE, { id, organizationId }),
    );
  }
}
