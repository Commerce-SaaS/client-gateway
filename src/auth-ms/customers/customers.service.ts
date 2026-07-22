import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { AUTH_SERVICE } from 'src/config';
import { PaginationCustomerDto } from './dto/pagination.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CUSTOMER_USER_PATTERNS } from './patterns/customer-user.patterns';
import { UpdateCustomerByAdminDto } from './dto/update-customer-by-admin.dto';

@Injectable()
export class CustomersService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  create(dto: CreateCustomerDto & { organizationId: string }) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.CREATE, dto);
  }

  findAll(paginationCustomerDto: PaginationCustomerDto) {
    return rpcSend(
      this.client,
      CUSTOMER_USER_PATTERNS.GET_ALL_PROFILES,
      paginationCustomerDto,
    );
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.GET_PROFILE_BY_ADMIN, {
      id,
      organizationId,
    });
  }
  update(id: string, dto: UpdateCustomerByAdminDto, organizationId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.UPDATE_BY_ADMIN, {
      id,
      organizationId,
      ...dto,
    });
  }
  softDelete(id: string, organizationId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.SOFT_DELETE_BY_ADMIN, {
      id,
      organizationId,
    });
  }
  delete(id: string, organizationId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.DELETE_BY_ADMIN, {
      id,
      organizationId,
    });
  }
  restoreByAdmin(id: string, organizationId: string) {
    return rpcSend(this.client, CUSTOMER_USER_PATTERNS.RESTORE_BY_ADMIN, {
      id,
      organizationId,
    });
  }
}
