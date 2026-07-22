import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodsPaginationDto } from './dto/payment-methods-pagination.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PAYMENT_METHOD_PATTERNS } from './patterns/payment-methods.patterns';
import { PAYMENT_SERVICE } from 'src/config/services';


@Injectable()
export class PaymentMethodsService {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(dto: CreatePaymentMethodDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.CREATE, {
      ...dto,
      organizationId,
    });
  }

  findAll(dto: PaymentMethodsPaginationDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.FIND_ALL, {
      ...dto,
      organizationId,
    });
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.FIND_ONE, {
      id,
      organizationId,
    });
  }

  update(id: string, dto: UpdatePaymentMethodDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.UPDATE, {
      id,
      organizationId,
      dto,
    });
  }

  restore(id: string, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.RESTORE, {
      id,
      organizationId,
    });
  }

  softDelete(id: string, organizationId: string) {
    return rpcSend(this.client, PAYMENT_METHOD_PATTERNS.SOFT_DELETE, {
      id,
      organizationId,
    });
  }
}