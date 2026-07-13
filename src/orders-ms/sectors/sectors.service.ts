import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config/services';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { SECTOR_PATTERNS } from './patterns/sector-patterns';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorsPaginationDto } from './dto/sectors-pagination.dto';

@Injectable()
export class SectorsService {
  constructor(@Inject(ORDERS_SERVICE) private readonly client: ClientProxy) {}

  create(dto: CreateSectorDto, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.CREATE, { ...dto, organizationId });
  }

  findAll(dto: SectorsPaginationDto, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.FIND_ALL, { ...dto, organizationId });
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.FIND_ONE, { id, organizationId });
  }

  update(id: string, dto: UpdateSectorDto, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.UPDATE, { id, ...dto, organizationId });
  }

  softDelete(id: string, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.SOFT_DELETE, { id, organizationId });
  }

  restore(id: string, organizationId: string) {
    return rpcSend(this.client, SECTOR_PATTERNS.RESTORE, { id, organizationId });
  }
}
